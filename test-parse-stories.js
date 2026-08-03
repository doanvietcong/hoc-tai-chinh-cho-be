// Quick parse test - dry run no API calls
const fs = require("fs");
const path = require("path");
const STORIES = path.join(__dirname, "lib", "stories.ts");
const src = fs.readFileSync(STORIES, "utf-8");
const blocks = src.split(/lessonId:\s*"/);
const stories = [];
for (let i = 1; i < blocks.length; i++) {
  const b = blocks[i];
  const idM = b.match(/^([a-z0-9-]+)"/);
  if (!idM) continue;
  const lessonId = idM[1];
  const re = /\btext:\s*"((?:[^"\\]|\\.)*)"/g;
  let m, idx = 0;
  while ((m = re.exec(b)) !== null) {
    const t = m[1]
      .replace(/\\"/g, '"')
      .replace(/\\n/g, " ")
      .replace(/\\\\/g, "\\")
      .trim();
    if (!t.length) continue;
    stories.push({ lessonId, sceneIdx: idx, text: t });
    idx++;
  }
}
const total = stories.reduce((s, x) => s + x.text.length, 0);
console.log("Total scenes:", stories.length);
console.log("Total chars:", total);
console.log("Sample[0]:", JSON.stringify(stories[0], null, 2));
console.log("Sample[5]:", JSON.stringify(stories[5], null, 2));
