#!/usr/bin/env node
/**
 * Capture QC baseline: MD5 hash of mỗi MP3 + hash of stories.ts.
 * Chạy lại mỗi khi:
 *   - Regen audio (intentional change)
 *   - Sau khi verify một lesson là "good"
 *
 * Usage:
 *   node scripts/qc-baseline.js
 *   node scripts/qc-baseline.js --lesson=money-1   # chỉ lesson này
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const STORIES = path.join(ROOT, "lib", "stories.ts");
const AUDIO_DIR = path.join(ROOT, "public", "audio");
const BASELINE = path.join(ROOT, ".qc-baseline.json");

const args = process.argv.slice(2);
const lessonFilter = args.find((a) => a.startsWith("--lesson="))?.split("=")[1];

function md5(p) {
  return crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex");
}

function main() {
  let baseline = fileExists(BASELINE)
    ? JSON.parse(fs.readFileSync(BASELINE, "utf-8"))
    : { hashes: {}, storiesHash: null, createdAt: null };

  // Update stories hash always
  baseline.storiesHash = md5(STORIES);

  // Update MP3 hashes
  const lessons = lessonFilter ? [lessonFilter] : fs.readdirSync(AUDIO_DIR);
  let updated = 0;
  for (const lessonId of lessons) {
    const dir = path.join(AUDIO_DIR, lessonId);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".mp3")) continue;
      const key = `${lessonId}/${file}`;
      baseline.hashes[key] = md5(path.join(dir, file));
      updated++;
    }
  }

  baseline.createdAt = new Date().toISOString();
  fs.writeFileSync(BASELINE, JSON.stringify(baseline, null, 2));
  console.log(`✓ Baseline updated: ${updated} MP3 files, stories.ts hash recorded`);
  console.log(`  Saved to: ${path.relative(ROOT, BASELINE)}`);
}

function fileExists(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

main();
