#!/usr/bin/env node
/**
 * Add ElevenLabs V3 audio tags to all story texts in lib/stories.ts.
 *
 * Approach: For each `text: "..."` line, find the NEAREST `mood: "..."` after it
 * (within the same scene object). Apply tag rules.
 *
 * Rules (in order, content-first then mood):
 *   [whispers] - "Bí mật", "Bí quyết", "LƯU Ý", "ĐỪNG bao giờ", "KHÔNG BAO GIỜ",
 *                "TRÚNG THƯỞNG", "VAY NHANH"
 *   [excited]  - "Tuyệt vời!", "Thần kỳ chưa nào?", celebrate mood
 *   [happy]    - happy mood
 *   [sighs]    - sad mood
 *   [cheerful] - wave mood
 *   [curious]  - thinking mood, hoặc câu hỏi kết thúc "?"
 *
 * Skip nếu text đã có audio tag ở 30 ký tự đầu (idempotent).
 *
 * Usage: node scripts/add-audio-tags.js [--force]
 *   --force: re-tag tất cả kể cả những text đã có tag
 */

const fs = require("fs");
const path = require("path");

const STORIES_PATH = path.join(__dirname, "..", "lib", "stories.ts");
const force = process.argv.includes("--force");

// ----- Audio tag helpers (same as before) -----

function tagBeforeKeyword(text, keyword, tag) {
  if (text.includes(`${tag} ${keyword}`)) return text;
  if (!text.includes(keyword)) return text;
  return text.replace(keyword, `${tag} ${keyword}`);
}

function prependTag(text, tag) {
  if (!tag) return text;
  if (!force && /^\s*\[[\w\s]+\]/.test(text)) return text;
  return `${tag} ${text}`;
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

function addTags(text, mood) {
  let t = text;
  t = applyContentTags(t);
  if (t.trimEnd().endsWith("?") && !t.includes("[curious]")) {
    t = t.trimEnd() + " [curious]";
  }
  t = applyMoodTag(t, mood);
  return t;
}

// ----- Parser: find text+mood pairs -----

function main() {
  const src = fs.readFileSync(STORIES_PATH, "utf-8");
  const lines = src.split(/\r?\n/);
  const out = [];
  let count = 0;
  let tagged = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    out.push(line);

    // Tìm dòng `text: "..."`
    const textMatch = line.match(/^(\s*)text:\s*"((?:[^"\\]|\\.)*)"\s*,?\s*$/);
    if (!textMatch) continue;

    const indent = textMatch[1];
    const rawText = textMatch[2];
    const text = rawText
      .replace(/\\"/g, '"')
      .replace(/\\n/g, " ")
      .replace(/\\\\/g, "\\");

    // Tìm mood gần nhất phía dưới (trong cùng scene, cùng indent)
    let mood = null;
    const expectedIndent = indent; // mood ở cùng indent với text
    for (let j = i + 1; j < Math.min(i + 30, lines.length); j++) {
      const l = lines[j];
      // Dừng nếu gặp `},` ở indent NHỎ HƠN (hết scene)
      if (/^\s*\},\s*$/.test(l)) {
        const closeIndent = l.search(/\S/);
        if (closeIndent < expectedIndent.length) {
          break;
        }
      }
      // Match mood ở cùng indent
      const moodMatch = l.match(/^(\s*)mood:\s*"([^"]+)"\s*,?\s*$/);
      if (moodMatch && moodMatch[1].length === expectedIndent.length) {
        mood = moodMatch[2];
        break;
      }
    }

    if (!mood) {
      console.warn(`⚠️  No mood found for line ${i + 1}: ${text.slice(0, 40)}...`);
      continue;
    }

    const newText = addTags(text, mood);
    count++;
    if (newText !== text) {
      tagged++;
      // Escape lại cho TS
      const escaped = newText
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');
      out[out.length - 1] = `${indent}text: "${escaped}",`;
    }
  }

  if (count === 0) {
    console.error("❌ Không tìm thấy scene nào. Kiểm tra format lib/stories.ts");
    process.exit(1);
  }

  if (tagged === 0) {
    console.log("⚠️  Không có thay đổi nào được áp dụng.");
    console.log("   Dùng --force để re-tag các scene đã có audio tag.");
    return;
  }

  fs.writeFileSync(STORIES_PATH, out.join("\n"), "utf-8");

  console.log(`✓ Processed ${count} scenes`);
  console.log(`  Tagged (added/changed audio tags): ${tagged} (${((tagged / count) * 100).toFixed(1)}%)`);
  console.log(`\n📁 Updated: ${STORIES_PATH}`);
  console.log(`\n💡 Chạy 'npm run generate-audio -- --force' để generate lại audio với V3 + audio tags.`);
}

main();
