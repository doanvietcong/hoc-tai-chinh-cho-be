// Count scenes per lesson in stories.ts and compare to MP3 files
const fs = require("fs");
const path = require("path");

const storiesPath = path.join(__dirname, "..", "lib", "stories.ts");
const audioDir = path.join(__dirname, "..", "public", "audio");
const src = fs.readFileSync(storiesPath, "utf-8");

// Parse each lesson block
const lessonRegex = /lessonId:\s*"([^"]+)"/g;
const textRegex = /^\s*text:\s*"[^"]+"/gm;
const starts = [];
let m;
while ((m = lessonRegex.exec(src)) !== null) {
  starts.push({ id: m[1], pos: m.index });
}

// Get scene count per lesson
const lessons = [];
for (let i = 0; i < starts.length; i++) {
  const start = starts[i].pos;
  const end = i + 1 < starts.length ? starts[i + 1].pos : src.length;
  const block = src.substring(start, end);
  const textCount = (block.match(/^\s*text:\s*"/gm) || []).length;
  lessons.push({ id: starts[i].id, scenes: textCount });
}

console.log("Lesson scene count vs MP3 file count:");
console.log("=====================================");
let totalMismatches = 0;
for (const l of lessons) {
  const dir = path.join(audioDir, l.id);
  const mp3Count = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => f.endsWith(".mp3")).length
    : 0;
  const status = mp3Count === l.scenes ? "✓" : "✗ MISMATCH";
  console.log(`${l.id.padEnd(12)} scenes=${l.scenes} mp3=${mp3Count} ${status}`);
  if (mp3Count !== l.scenes) totalMismatches++;
}
console.log(`\nTotal mismatches: ${totalMismatches}`);
console.log(`Total scenes: ${lessons.reduce((s, l) => s + l.scenes, 0)}`);
console.log(`Total MP3 files: ${fs.readdirSync(audioDir).reduce((s, d) => s + fs.readdirSync(path.join(audioDir, d)).filter(f => f.endsWith(".mp3")).length, 0)}`);
