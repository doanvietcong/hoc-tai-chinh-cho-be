#!/usr/bin/env node
/**
 * Export stories with audio tags ra file .md theo từng lesson.
 * Dùng để review hoặc copy-paste vào ElevenLabs web UI.
 *
 * Output: stories-by-lesson.md (workspace root)
 */

const fs = require("fs");
const path = require("path");

const STORIES_PATH = path.join(__dirname, "..", "lib", "stories.ts");
const OUT_PATH = path.join(__dirname, "..", "stories-by-lesson.md");

function parseStories() {
  const src = fs.readFileSync(STORIES_PATH, "utf-8");
  const stories = [];
  let current = null;
  let sceneIdx = 0;

  // Track current story by lessonId
  const lessonRegex = /^\s*lessonId:\s*"([^"]+)"/;
  const titleRegex = /^\s*title:\s*"([^"]+)"/;
  const durRegex = /^\s*estDurationSec:\s*(\d+)/;
  const textRegex = /^(\s*)text:\s*"((?:[^"\\]|\\.)*)"\s*,?\s*$/;

  const lines = src.split(/\r?\n/);
  for (const line of lines) {
    const lessonM = line.match(lessonRegex);
    if (lessonM) {
      if (current) stories.push(current);
      current = {
        lessonId: lessonM[1],
        title: "",
        estDurationSec: 0,
        scenes: [],
      };
      sceneIdx = 0;
      continue;
    }
    if (!current) continue;

    const titleM = line.match(titleRegex);
    if (titleM) {
      current.title = titleM[1];
      continue;
    }
    const durM = line.match(durRegex);
    if (durM) {
      current.estDurationSec = parseInt(durM[1], 10);
      continue;
    }
    const textM = line.match(textRegex);
    if (textM) {
      const text = textM[2]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, " ")
        .replace(/\\\\/g, "\\");
      current.scenes.push(text);
      sceneIdx++;
    }
  }
  if (current) stories.push(current);
  return stories;
}

function main() {
  const stories = parseStories();
  console.log(`Found ${stories.length} stories`);

  const lines = [];
  lines.push("# 📖 Pé Ti Stories — Theo từng bài (cho ElevenLabs V3)");
  lines.push("");
  const totalScenes = stories.reduce((s, x) => s + x.scenes.length, 0);
  lines.push(`> Tổng: **${stories.length} bài học**, **${totalScenes} scenes**.`);
  lines.push(`> Tất cả đã có audio tags V3: \`[excited]\` \`[happy]\` \`[curious]\` \`[whispers]\` \`[sighs]\` \`[cheerful]\``);
  lines.push("");
  lines.push("---");
  lines.push("");

  let totalChars = 0;
  for (const s of stories) {
    const lessonChars = s.scenes.reduce((sum, t) => sum + t.length, 0);
    totalChars += lessonChars;
    lines.push(`## 📚 ${s.lessonId} — ${s.title}`);
    lines.push("");
    lines.push(`⏱️ ${s.estDurationSec}s | 🎬 ${s.scenes.length} scenes | 📝 ${lessonChars} chars`);
    lines.push("");
    s.scenes.forEach((t, i) => {
      lines.push(`**Scene ${i + 1}:** ${t}`);
      lines.push("");
    });
    lines.push("---");
    lines.push("");
  }

  lines.push("## 📊 Tổng kết");
  lines.push("");
  lines.push(`- **Tổng ký tự**: ${totalChars.toLocaleString()}`);
  lines.push(`- **ElevenLabs V3 free tier**: 10,000 chars/tháng (V3 charge gấp đôi = ~5,000 effective)`);
  lines.push(`- **Dự kiến**: ${totalChars > 5000 ? "⚠️ VƯỢT free tier" : "✅ Trong free tier"} — chạy nhiều lần với \`--lesson=X-Y\` để chia nhỏ`);
  lines.push("");

  fs.writeFileSync(OUT_PATH, lines.join("\n"), "utf-8");
  console.log(`✓ Exported: ${OUT_PATH}`);
  console.log(`  ${stories.length} lessons, ${totalScenes} scenes, ${totalChars} total chars`);
}

main();
