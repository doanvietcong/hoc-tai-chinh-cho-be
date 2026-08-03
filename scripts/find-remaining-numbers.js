// Find remaining numbers in story text fields
const fs = require("fs");
const src = fs.readFileSync("lib/stories.ts", "utf-8");
const re = /\btext:\s*"((?:[^"\\]|\\.)*)"/g;
let m;
const found = [];
while ((m = re.exec(src)) !== null) {
  const text = m[1];
  const nums = text.match(/\b\d+\b/g);
  if (nums) {
    const lineNum = src.substring(0, m.index).split("\n").length;
    found.push({ line: lineNum, text: text.slice(0, 100), nums });
  }
}
console.log("Found", found.length, "text fields with remaining numbers:");
for (const f of found.slice(0, 30)) {
  console.log("L" + f.line + ":", f.text, "=>", f.nums);
}
