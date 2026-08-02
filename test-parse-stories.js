// Test parseStories function from generate-audio.js
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
console.log(`Total scenes found: ${stories.length}`);

const byLesson = {};
for (const s of stories) {
  if (!byLesson[s.lessonId]) byLesson[s.lessonId] = [];
  byLesson[s.lessonId].push(s);
}
console.log(`Total lessons with stories: ${Object.keys(byLesson).length}`);
console.log("\nPer lesson:");
for (const [id, scenes] of Object.entries(byLesson)) {
  console.log(`  ${id}: ${scenes.length} scenes`);
}

const totalChars = stories.reduce((sum, s) => sum + s.text.length, 0);
console.log(`\nTotal characters: ${totalChars}`);
console.log(`FPT.AI free tier: 20,000 chars/month`);
console.log(`Usage: ${((totalChars / 20000) * 100).toFixed(1)}% of free tier`);

// Check for duplicates (lesson should have scene 0, 1, 2, ...)
let dupes = 0;
for (const [id, scenes] of Object.entries(byLesson)) {
  const indices = scenes.map(s => s.sceneIdx).sort((a, b) => a - b);
  for (let i = 0; i < indices.length; i++) {
    if (indices[i] !== i) {
      console.log(`  ⚠️  ${id}: scene indices ${JSON.stringify(indices)} (expected 0,1,2...)`);
      dupes++;
    }
  }
}
console.log(`\nLessons with non-sequential indices: ${dupes}`);
