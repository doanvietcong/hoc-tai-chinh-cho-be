// Find all number patterns that need to be converted to Vietnamese words for TTS
const fs = require("fs");
const path = require("path");

const STORIES = path.join(__dirname, "..", "lib", "stories.ts");
const LESSONS = path.join(__dirname, "..", "lib", "lessons.ts");

const storiesSrc = fs.readFileSync(STORIES, "utf-8");
const lessonsSrc = fs.readFileSync(LESSONS, "utf-8");

// Patterns to find (TTS needs Vietnamese words, not numerals)
const patterns = [
  // Money: 1.000đ, 10.000đ, 1.000.000đ
  { regex: /(\d{1,3}(?:\.\d{3})+|\d+)đ/g, label: "Money (VND)" },
  // Percentage: 10%, 6.5%
  { regex: /(\d+(?:[.,]\d+)?)%/g, label: "Percentage" },
  // Decimal numbers in text
  { regex: /\b\d+\.\d+\b/g, label: "Decimal" },
  // Just big numbers (1.000.000)
  { regex: /\b\d{1,3}(?:\.\d{3})+\b/g, label: "Number with dots" },
];

console.log("=== stories.ts ===");
for (const p of patterns) {
  const matches = [...storiesSrc.matchAll(p.regex)];
  if (matches.length > 0) {
    console.log(`\n${p.label}: ${matches.length} matches`);
    for (const m of matches.slice(0, 5)) {
      const idx = m.index;
      const lineStart = storiesSrc.lastIndexOf("\n", idx) + 1;
      const lineEnd = storiesSrc.indexOf("\n", idx);
      const line = storiesSrc.substring(lineStart, lineEnd).trim();
      console.log(`  "${m[0]}" in: ${line.slice(0, 80)}...`);
    }
    if (matches.length > 5) console.log(`  ... +${matches.length - 5} more`);
  }
}

console.log("\n\n=== lessons.ts ===");
for (const p of patterns) {
  const matches = [...lessonsSrc.matchAll(p.regex)];
  if (matches.length > 0) {
    console.log(`\n${p.label}: ${matches.length} matches`);
    for (const m of matches.slice(0, 5)) {
      const idx = m.index;
      const lineStart = lessonsSrc.lastIndexOf("\n", idx) + 1;
      const lineEnd = lessonsSrc.indexOf("\n", idx);
      const line = lessonsSrc.substring(lineStart, lineEnd).trim();
      console.log(`  "${m[0]}" in: ${line.slice(0, 80)}...`);
    }
    if (matches.length > 5) console.log(`  ... +${matches.length - 5} more`);
  }
}
