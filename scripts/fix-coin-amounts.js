// Fix coin amounts in stories.ts: amount was supposed to be in VND but is in thousands
// e.g. amount: 5 should be 5000 (5 nghìn = 5.000đ)
const fs = require("fs");
const path = require("path");

const STORIES = path.join(__dirname, "..", "lib", "stories.ts");
let src = fs.readFileSync(STORIES, "utf-8");

// Match: type: "coin", amount: <number>, tone: ...
// If amount < 1000, multiply by 1000
let count = 0;
src = src.replace(/(\btype:\s*"coin"\s*,\s*amount:\s*)(\d+)(\s*,\s*tone:)/g, (m, prefix, num, suffix) => {
  const n = parseInt(num);
  if (n < 1000) {
    count++;
    return prefix + (n * 1000) + suffix;
  }
  return m;
});

fs.writeFileSync(STORIES, src);
console.log(`✓ Fixed ${count} coin amounts (multiplied by 1000)`);
