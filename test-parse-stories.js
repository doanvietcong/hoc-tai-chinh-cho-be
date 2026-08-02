// Quick test: re-extract parseStories from generate-audio.js
const fs = require("fs");
const path = require("path");

const STORIES_PATH = path.join(__dirname, "lib", "stories.ts");

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

const stories = parseStories();
const byLesson = {};
stories.forEach((s) => {
  byLesson[s.lessonId] = (byLesson[s.lessonId] || 0) + 1;
});

const totalChars = stories.reduce((s, x) => s + x.text.length, 0);

console.log("=== Parse test ===");
console.log("Scenes parsed:", stories.length);
console.log("Lessons:", Object.keys(byLesson).length);
console.log("Total chars:", totalChars);
console.log("");
console.log("Quota check:");
console.log("  ElevenLabs free (10K):", ((totalChars / 10000) * 100).toFixed(1) + "%");
console.log("  FPT.AI free (20K):", ((totalChars / 20000) * 100).toFixed(1) + "%");
console.log("");
console.log("Per lesson:");
for (const [id, count] of Object.entries(byLesson)) {
  console.log("  " + id + ": " + count + " scenes");
}
