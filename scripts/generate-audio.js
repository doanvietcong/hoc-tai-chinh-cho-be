#!/usr/bin/env node
/**
 * Generate Vietnamese TTS audio files for all Pé Ti stories.
 *
 * Supports multiple TTS providers (auto-detect từ .env.local):
 *   - elevenlabs  (RECOMMENDED) - ElevenLabs V3, giọng AI tự nhiên, hỗ trợ audio tags
 *   - vbee        - Vbee.vn, giọng Việt native, free ~100K chars/tháng
 *   - fpt         - FPT.AI TTS, giọng Việt chuẩn, free 20K chars/tháng
 *
 * Usage:
 *   1. Set API key trong .env.local (ELEVENLABS_API_KEY / VBEE_API_KEY / FPT_AI_API_KEY)
 *   2. Run: npm run generate-audio [-- --force] [-- --lesson=saving-1]
 *   3. Files MP3 xuất hiện trong public/audio/{lessonId}/{sceneIdx}.mp3
 *
 * Flags:
 *   --force          : regen tất cả audio kể cả file đã có
 *   --lesson=X-Y     : chỉ generate 1 lesson (vd: --lesson=saving-1)
 *                       Hữu ích khi free tier bị giới hạn, generate từng bài một
 *
 * ElevenLabs V3 audio tags (chèn trực tiếp trong text để tạo biểu cảm):
 *   [excited]  [whispers]  [laughs]  [sighs]  [happy]  [sad]  [cheerful]  [curious]
 *   Ví dụ: "Hôm nay [excited] Pé Ti sẽ kể cho bạn nghe về tiền nhé!"
 *
 * Docs:
 *   - GUIDE_ELEVENLABS.md
 *   - GUIDE_VBEE.md
 *   - GUIDE_FPT_TTS.md
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const { URL } = require("url");

// ----- Paths -----
const STORIES_PATH = path.join(__dirname, "..", "lib", "stories.ts");
const OUT_DIR = path.join(__dirname, "..", "public", "audio");

// ----- Config -----
const REQUEST_DELAY_MS = 1100; // rate limit giữa các request

// ElevenLabs defaults
const EL_VOICE_ID_DEFAULT = "pNInz6obpgDQGcFmaJgB"; // "Adam" - male, deep, narrative
// ElevenLabs V3 - mới nhất (2025), hỗ trợ tiếng Việt + audio tags ([excited], [whispers]...)
// Các model khả dụng:
//   eleven_v3          - chuẩn, expressive nhất (RECOMMENDED cho kể chuyện)
//   eleven_turbo_v3    - nhanh hơn, ít expressive hơn
//   eleven_multilingual_v2 - fallback nếu V3 chưa available
const EL_MODEL_ID_DEFAULT = "eleven_v3";
// Voice ID gợi ý:
//   pNInz6obpgDQGcFmaJgB - Adam (nam, trầm, kể chuyện tốt)
//   21m00Tcm4TlvDq8ikWAM - Rachel (nữ, dịu dàng)
//   AZnzlk1XvdvUeBnXmlld - Domi (nữ, trẻ trung)
//   EXAVITQu4vr4xnSDxMaL - Bella (nữ, mềm mại)
//   2EiwWnXFnvU5JinP4o6y - Sam (nam, kể chuyện)
//   gU0LNdkMOjJABWrEB4h3 - Charlie (nam, năng động)

// FPT.AI defaults
const FPT_VOICE_DEFAULT = "lemy"; // nữ, miền Nam
const FPT_SPEED_DEFAULT = "1";

// Vbee defaults
// Voice codes từ Vbee voice library. Free tier accounts thường có sẵn các giọng miền Bắc & Nam.
// Một số voice codes phổ biến (verify trong dashboard Vbee của anh):
//   hn_female_ngochuyen_full_48k-fhg  - Ngọc Huyền (nữ, miền Bắc, tự nhiên, kể chuyện tốt)
//   hn_male_minhquang_full_48k-fhg   - Minh Quang (nam, miền Bắc)
//   hcm_female_thuyduong_full_48k-fhg - Thùy Dương (nữ, miền Nam)
//   hcm_male_minhtriet_full_48k-fhg  - Minh Triết (nam, miền Nam)
const VBEE_VOICE_DEFAULT = "hn_female_ngochuyen_full_48k-fhg";
const VBEE_SPEED_DEFAULT = 1.0;

// ----- Load env -----
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ Không tìm thấy file .env.local");
    console.error("   Tạo file .env.local với API key. Xem GUIDE_ELEVENLABS.md hoặc GUIDE_FPT_TTS.md.");
    process.exit(1);
  }
  const envContent = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of envContent.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
  return env;
}

// ----- Pick provider -----
function pickProvider(env) {
  const explicit = (env.TTS_PROVIDER || "").toLowerCase().trim();
  if (["vbee", "elevenlabs", "fpt"].includes(explicit)) return explicit;

  // Auto-detect theo thứ tự ưu tiên
  if (env.ELEVENLABS_API_KEY) return "elevenlabs";
  if (env.VBEE_API_KEY) return "vbee";
  if (env.FPT_AI_API_KEY) return "fpt";

  return null;
}

// ----- Parse stories.ts -----
function parseStories() {
  const src = fs.readFileSync(STORIES_PATH, "utf-8");
  const storyBlocks = src.split(/lessonId:\s*"/);
  const stories = [];

  for (let i = 1; i < storyBlocks.length; i++) {
    const block = storyBlocks[i];
    const idMatch = block.match(/^([a-z0-9-]+)"/);
    if (!idMatch) continue;
    const lessonId = idMatch[1];

    const textRegex = /\btext:\s*"((?:[^"\\]|\\.)*)"/g;
    const moodRegex = /\bmood:\s*"([^"]+)"/g;
    const mList = [...block.matchAll(moodRegex)].map((m) => m[1]);
    let m;
    let idx = 0;
    while ((m = textRegex.exec(block)) !== null) {
      const text = m[1]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, " ")
        .replace(/\\\\/g, "\\")
        .trim();
      if (text.length === 0) continue;
      const mood = mList[idx] || "neutral";
      stories.push({ lessonId, sceneIdx: idx, text, mood });
      idx++;
    }
  }

  return stories;
}

// ----- Audio tag helpers (mirror scripts/add-audio-tags.js) -----
function tagBeforeKeyword(text, keyword, tag) {
  if (text.includes(`${tag} ${keyword}`)) return text;
  if (!text.includes(keyword)) return text;
  return text.replace(keyword, `${tag} ${keyword}`);
}

function prependTag(text, tag) {
  if (!tag) return text;
  if (/^\s*\[[\w\s]+\]/.test(text)) return text; // đã có tag
  return `${tag} ${text}`;
}

function applyContentTags(text) {
  let t = text;
  t = tagBeforeKeyword(t, "Bí mật", "[whispers]");
  t = tagBeforeKeyword(t, "Bí quyết", "[whispers]");
  t = tagBeforeKeyword(t, "LƯU Ý", "[whispers]");
  t = tagBeforeKeyword(t, "ĐỪNG bao giờ", "[whispers]");
  t = tagBeforeKeyword(t, "KHÔNG BAO GIỜ", "[whispers]");
  t = tagBeforeKeyword(t, "TRÚNG THƯỞNG", "[whispers]");
  t = tagBeforeKeyword(t, "VAY NHANH", "[whispers]");
  t = t.replace(/(?<!\] )Tuyệt vời!/g, "Tuyệt vời! [excited]");
  t = t.replace(/(?<!\] )Thần kỳ chưa nào\?/g, "Thần kỳ chưa nào? [excited]");
  return t;
}

function applyMoodTag(text, mood) {
  const moodToTag = {
    celebrate: "[excited]",
    happy: "[happy]",
    thinking: "[curious]",
    sad: "[sighs]",
    wave: "[cheerful]",
    neutral: null,
  };
  const tag = moodToTag[mood];
  if (!tag) return text;
  return prependTag(text, tag);
}

/** Add audio tags V3 nếu text chưa có. Idempotent. */
function addAudioTagsIfMissing(text, mood) {
  let t = text;
  t = applyContentTags(t);
  if (t.trimEnd().endsWith("?") && !t.includes("[curious]")) {
    t = t.trimEnd() + " [curious]";
  }
  t = applyMoodTag(t, mood);
  return t;
}

// ----- HTTP helper -----
function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks),
        });
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// ----- Provider: ElevenLabs -----
async function callElevenLabs(text, env) {
  const apiKey = env.ELEVENLABS_API_KEY;
  const voiceId = env.ELEVENLABS_VOICE_ID || EL_VOICE_ID_DEFAULT;
  const modelId = env.ELEVENLABS_MODEL_ID || EL_MODEL_ID_DEFAULT;

  const url = new URL(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
  );

  // V3 voice settings: stability thấp = biểu cảm hơn (V3 mặc định rất expressive)
  // V2 voice settings: stability 0.5, similarity 0.75 (ổn định hơn)
  const isV3 = modelId.startsWith("eleven_v3") || modelId.startsWith("eleven_turbo_v3");
  const voiceSettings = isV3
    ? {
        stability: 0.3,        // V3: thấp = expressive hơn
        similarity_boost: 0.75,
        style: 0.4,             // V3: thêm style để có cảm xúc
        use_speaker_boost: true,
        speed: 0.95,            // V3: chậm hơn một chút cho dễ nghe (trẻ nhỏ)
      }
    : {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
      };

  const bodyObj = {
    text,
    model_id: modelId,
    voice_settings: voiceSettings,
  };
  const body = JSON.stringify(bodyObj);

  const res = await httpRequest(
    {
      method: "POST",
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body,
  );

  if (res.statusCode !== 200) {
    const errText = res.body.toString("utf-8").slice(0, 300);
    throw new Error(`HTTP ${res.statusCode}: ${errText}`);
  }

  const ct = res.headers["content-type"] || "";
  if (!ct.includes("audio") && !ct.includes("mpeg")) {
    throw new Error(`Unexpected content-type: ${ct} - ${res.body.toString("utf-8").slice(0, 200)}`);
  }

  return res.body;
}

// ----- Provider: FPT.AI -----
async function callFptTts(text, env) {
  const apiKey = env.FPT_AI_API_KEY;
  const voice = env.FPT_AI_VOICE || FPT_VOICE_DEFAULT;
  const speed = env.FPT_AI_SPEED || FPT_SPEED_DEFAULT;

  const url = new URL("https://api.fpt.ai/hmi/tts/v5");
  const body = text;

  const res = await httpRequest(
    {
      method: "POST",
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        "api_key": apiKey,
        voice,
        speed,
        "Content-Type": "text/plain",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body,
  );

  if (res.statusCode !== 200) {
    throw new Error(`HTTP ${res.statusCode}: ${res.body.toString("utf-8").slice(0, 200)}`);
  }

  return res.body;
}

// ----- Provider: Vbee -----
async function callVbeeTts(text, env) {
  const apiKey = env.VBEE_API_KEY;
  const voiceCode = env.VBEE_VOICE_CODE || VBEE_VOICE_DEFAULT;
  const speed = parseFloat(env.VBEE_SPEED || VBEE_SPEED_DEFAULT);

  // Vbee API v1: POST /api/v1/tts
  // Docs: https://vbee.vn (verify current API)
  const url = new URL("https://vbee.vn/api/v1/tts");
  const bodyObj = {
    text,
    voice_code: voiceCode,
    audio_type: "mp3",
    bit_rate: 128000,
    speed_rate: speed,
    // response_type: "audio" returns direct binary; default returns JSON
    response_type: "audio",
  };
  const body = JSON.stringify(bodyObj);

  const res = await httpRequest(
    {
      method: "POST",
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        "apikey": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body,
  );

  if (res.statusCode !== 200) {
    const errText = res.body.toString("utf-8").slice(0, 300);
    throw new Error(`HTTP ${res.statusCode}: ${errText}`);
  }

  const ct = res.headers["content-type"] || "";
  // Direct audio response
  if (ct.includes("audio") || ct.includes("mpeg")) {
    return res.body;
  }

  // JSON response với audio_url
  try {
    const json = JSON.parse(res.body.toString("utf-8"));
    if (json.audio_url) {
      // Download từ URL
      const dlUrl = new URL(json.audio_url);
      const dlRes = await httpRequest({
        method: "GET",
        hostname: dlUrl.hostname,
        path: dlUrl.pathname + dlUrl.search,
        headers: { "apikey": apiKey },
      });
      if (dlRes.statusCode !== 200) {
        throw new Error(`Download failed HTTP ${dlRes.statusCode}`);
      }
      return dlRes.body;
    }
    if (json.data && json.data.audio_url) {
      const dlUrl = new URL(json.data.audio_url);
      const dlRes = await httpRequest({
        method: "GET",
        hostname: dlUrl.hostname,
        path: dlUrl.pathname + dlUrl.search,
        headers: { "apikey": apiKey },
      });
      if (dlRes.statusCode !== 200) {
        throw new Error(`Download failed HTTP ${dlRes.statusCode}`);
      }
      return dlRes.body;
    }
    throw new Error("Unexpected Vbee response: " + JSON.stringify(json).slice(0, 200));
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error("Non-JSON response: " + res.body.toString("utf-8").slice(0, 200));
    }
    throw e;
  }
}

// ----- Main -----
async function main() {
  console.log("🎙️  Pé Ti TTS Audio Generator\n");

  const env = loadEnv();
  const provider = pickProvider(env);

  if (!provider) {
    console.error("❌ Không tìm thấy API key trong .env.local");
    console.error("   Cần 1 trong 2:");
    console.error("     - ELEVENLABS_API_KEY=sk_...");
    console.error("     - FPT_AI_API_KEY=...");
    console.error("   Xem GUIDE_ELEVENLABS.md hoặc GUIDE_FPT_TTS.md");
    process.exit(1);
  }

  // Parse --lesson=X-Y flag (filter theo lesson)
  const lessonArg = process.argv.find((a) => a.startsWith("--lesson="));
  const lessonFilter = lessonArg ? lessonArg.split("=")[1].trim() : null;
  if (lessonFilter) {
    console.log(`   Filter: chỉ generate lesson "${lessonFilter}"`);
  }

  console.log(`   Provider: ${provider.toUpperCase()}`);
  if (provider === "elevenlabs") {
    console.log(
      `   Voice: ${env.ELEVENLABS_VOICE_ID || EL_VOICE_ID_DEFAULT} (model: ${env.ELEVENLABS_MODEL_ID || EL_MODEL_ID_DEFAULT})`,
    );
  } else if (provider === "vbee") {
    console.log(
      `   Voice: ${env.VBEE_VOICE_CODE || VBEE_VOICE_DEFAULT} (speed: ${env.VBEE_SPEED || VBEE_SPEED_DEFAULT})`,
    );
  } else {
    console.log(
      `   Voice: ${env.FPT_AI_VOICE || FPT_VOICE_DEFAULT} (speed: ${env.FPT_AI_SPEED || FPT_SPEED_DEFAULT})`,
    );
  }

  const allStories = parseStories();
  const stories = lessonFilter
    ? allStories.filter((s) => s.lessonId === lessonFilter)
    : allStories;
  console.log(`   Found ${stories.length}/${allStories.length} scenes in stories.ts\n`);

  if (stories.length === 0) {
    if (lessonFilter) {
      console.error(`❌ Không tìm thấy lesson "${lessonFilter}". Kiểm tra lại lessonId.`);
      console.error(`   Các lesson có sẵn: ${[...new Set(allStories.map(s => s.lessonId))].join(", ")}`);
    } else {
      console.error("❌ Không tìm thấy scene nào. Kiểm tra lib/stories.ts");
    }
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let providerFn;
  if (provider === "elevenlabs") providerFn = callElevenLabs;
  else if (provider === "vbee") providerFn = callVbeeTts;
  else providerFn = callFptTts;

  // Quota info
  const totalChars = stories.reduce((s, x) => s + x.text.length, 0);
  const freeLimit =
    provider === "elevenlabs" ? 10000 : provider === "fpt" ? 20000 : 100000;
  const freeProvider =
    provider === "elevenlabs"
      ? "ElevenLabs"
      : provider === "fpt"
        ? "FPT.AI"
        : "Vbee";
  console.log(
    `   Tổng ký tự: ${totalChars} (${((totalChars / freeLimit) * 100).toFixed(1)}% free tier ${freeProvider})\n`,
  );
  if (totalChars > freeLimit) {
    console.warn(
      `⚠️  CẢNH BÁO: Vượt quá free tier! Một số request sẽ fail.\n`,
    );
  }

  let okCount = 0;
  let skipCount = 0;
  let errCount = 0;

  for (let i = 0; i < stories.length; i++) {
    const { lessonId, sceneIdx, text, mood } = stories[i];
    // Auto-add audio tags nếu text sạch (chưa có [xxx] ở đầu)
    const taggedText = addAudioTagsIfMissing(text, mood || "neutral");
    const outPath = path.join(OUT_DIR, lessonId, `${sceneIdx}.mp3`);

    if (fs.existsSync(outPath) && !process.argv.includes("--force")) {
      skipCount++;
      console.log(
        `   ⏭  [${i + 1}/${stories.length}] ${lessonId}/${sceneIdx}.mp3 (exists)`,
      );
      continue;
    }

    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    try {
      const audio = await providerFn(taggedText, env);
      fs.writeFileSync(outPath, audio);
      okCount++;
      const preview = taggedText.slice(0, 45).replace(/\n/g, " ");
      console.log(
        `   ✓ [${i + 1}/${stories.length}] ${lessonId}/${sceneIdx}.mp3 (${(audio.length / 1024).toFixed(1)}KB) "${preview}..."`,
      );
    } catch (err) {
      errCount++;
      console.error(
        `   ✗ [${i + 1}/${stories.length}] ${lessonId}/${sceneIdx}.mp3 - ${err.message.slice(0, 100)}`,
      );
    }

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

  if (okCount > 0) {
    console.log(`\n🎉 Xong! Bây giờ commit và push:`);
    console.log(`   git add public/audio/`);
    console.log(`   git commit -m "feat: TTS audio (${provider})"`);
    console.log(`   git push`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return [];
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
