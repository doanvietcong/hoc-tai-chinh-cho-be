#!/usr/bin/env node
/**
 * Generate Vietnamese TTS audio files for all Pé Ti stories.
 *
 * Usage:
 *   1. Set FPT_AI_API_KEY in .env.local
 *   2. Run: npm run generate-audio
 *
 * Output:
 *   public/audio/{lessonId}/{sceneIdx}.mp3
 *
 * Docs: see GUIDE_FPT_TTS.md
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const { URL } = require("url");

// ----- Config -----
const VOICE = "lemy"; // FPT.AI voice ID (nữ, miền Nam, dễ thương)
const SPEED = "1"; // 0=slow, 1=normal, 2=fast, 3=very fast
const REQUEST_DELAY_MS = 1100; // rate limit: 1 req/sec
const STORIES_PATH = path.join(__dirname, "..", "lib", "stories.ts");
const OUT_DIR = path.join(__dirname, "..", "public", "audio");

// ----- Load env -----
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ Không tìm thấy file .env.local");
    console.error("   Tạo file .env.local với: FPT_AI_API_KEY=your_key_here");
    console.error("   Xem GUIDE_FPT_TTS.md để biết chi tiết.");
    process.exit(1);
  }
  const envContent = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of envContent.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
  if (!env.FPT_AI_API_KEY) {
    console.error("❌ FPT_AI_API_KEY chưa có trong .env.local");
    process.exit(1);
  }
  return env.FPT_AI_API_KEY;
}

// ----- Parse stories.ts (regex, no deps) -----
function parseStories() {
  const src = fs.readFileSync(STORIES_PATH, "utf-8");

  // Split by lessonId first to get one block per story.
  const storyBlocks = src.split(/lessonId:\s*"/);
  const stories = [];

  for (let i = 1; i < storyBlocks.length; i++) {
    const block = storyBlocks[i];
    const idMatch = block.match(/^([a-z0-9-]+)"/);
    if (!idMatch) continue;
    const lessonId = idMatch[1];

    // In each block, extract all `text: "..."` fields.
    // Each scene has exactly one `text:` field, and the lesson object uses
    // `title:` / `subtitle:` / `explainer:` instead, so this is safe.
    const textRegex = /\btext:\s*"((?:[^"\\]|\\.)*)"/g;
    let m;
    let idx = 0;
    while ((m = textRegex.exec(block)) !== null) {
      const text = m[1]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, " ")
        .replace(/\\\\/g, "\\")
        .trim();
      if (text.length === 0) continue;
      stories.push({ lessonId, sceneIdx: idx, text });
      idx++;
    }
  }

  return stories;
}

// ----- FPT.AI TTS API -----
function callFptTts(text, apiKey) {
  return new Promise((resolve, reject) => {
    const url = new URL("https://api.fpt.ai/hmi/tts/v5");
    const body = text;
    const options = {
      method: "POST",
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        "api_key": apiKey,
        "voice": VOICE,
        "speed": SPEED,
        "Content-Type": "text/plain",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const chunks = [];
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errBody = "";
        res.on("data", (c) => (errBody += c));
        res.on("end", () =>
          reject(
            new Error(
              `HTTP ${res.statusCode}: ${errBody.slice(0, 200)}`,
            ),
          ),
        );
        return;
      }
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        // FPT.AI returns MP3 binary directly (not async job)
        // Check Content-Type
        const ct = res.headers["content-type"] || "";
        if (ct.includes("audio") || ct.includes("mpeg")) {
          resolve(Buffer.concat(chunks));
        } else {
          // Try parsing as JSON (error or async)
          const text = Buffer.concat(chunks).toString("utf-8");
          try {
            const json = JSON.parse(text);
            if (json.async) {
              // FPT.AI returns async job for v5
              // We need to poll
              pollAsyncJob(json.async, apiKey)
                .then(resolve)
                .catch(reject);
            } else {
              reject(new Error("Unexpected response: " + text.slice(0, 200)));
            }
          } catch {
            reject(new Error("Unexpected response: " + text.slice(0, 200)));
          }
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function pollAsyncJob(asyncUrl, apiKey) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = 2000;

    const tick = () => {
      attempts++;
      const url = new URL(asyncUrl);
      const req = https.request(
        {
          method: "GET",
          hostname: url.hostname,
          path: url.pathname + url.search,
          headers: { "api_key": apiKey, "voice": VOICE, "speed": SPEED },
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            const data = Buffer.concat(chunks);
            if (res.statusCode === 200 && data.length > 1000) {
              resolve(data);
            } else {
              if (attempts >= maxAttempts) {
                reject(new Error("Async job timeout"));
              } else {
                setTimeout(tick, interval);
              }
            }
          });
        },
      );
      req.on("error", reject);
      req.end();
    };
    tick();
  });
}

// ----- Main -----
async function main() {
  console.log("🎙️  Pé Ti TTS Audio Generator (FPT.AI)\n");

  const apiKey = loadEnv();
  console.log(`   Voice: ${VOICE}, Speed: ${SPEED}`);

  const stories = parseStories();
  console.log(`   Found ${stories.length} scenes in stories.ts\n`);

  if (stories.length === 0) {
    console.error("❌ Không tìm thấy scene nào. Kiểm tra file lib/stories.ts");
    process.exit(1);
  }

  // Ensure out dir
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let okCount = 0;
  let skipCount = 0;
  let errCount = 0;

  for (let i = 0; i < stories.length; i++) {
    const { lessonId, sceneIdx, text } = stories[i];
    const outPath = path.join(OUT_DIR, lessonId, `${sceneIdx}.mp3`);

    // Skip if already exists (for idempotent re-runs)
    if (fs.existsSync(outPath) && process.argv.includes("--force") === false) {
      skipCount++;
      console.log(
        `   ⏭  [${i + 1}/${stories.length}] ${lessonId}/${sceneIdx}.mp3 (exists, skip)`,
      );
      continue;
    }

    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    try {
      const audio = await callFptTts(text, apiKey);
      fs.writeFileSync(outPath, audio);
      okCount++;
      const preview = text.slice(0, 50).replace(/\n/g, " ");
      console.log(
        `   ✓ [${i + 1}/${stories.length}] ${lessonId}/${sceneIdx}.mp3 (${(audio.length / 1024).toFixed(1)}KB) "${preview}..."`,
      );
    } catch (err) {
      errCount++;
      console.error(
        `   ✗ [${i + 1}/${stories.length}] ${lessonId}/${sceneIdx}.mp3 - ${err.message}`,
      );
    }

    // Rate limit delay
    if (i < stories.length - 1) {
      await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
    }
  }

  const totalSize = walkDir(OUT_DIR)
    .filter((f) => f.endsWith(".mp3"))
    .reduce((sum, f) => sum + fs.statSync(f).size, 0);

  console.log(`\n📊 Kết quả:`);
  console.log(`   ✓ Tạo mới: ${okCount}`);
  console.log(`   ⏭  Skip (đã có): ${skipCount}`);
  console.log(`   ✗ Lỗi: ${errCount}`);
  console.log(`   📁 Tổng dung lượng: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\n🎉 Xong! Bây giờ commit và push:`);
  console.log(`   git add public/audio/`);
  console.log(`   git commit -m "feat: FPT.AI Vietnamese TTS audio"`);
  console.log(`   git push`);
}

function walkDir(dir) {
  const out = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) out.push(...walkDir(p));
    else out.push(p);
  }
  return out;
}

main().catch((err) => {
  console.error("\n❌ Lỗi:", err.message);
  process.exit(1);
});
