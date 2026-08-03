// Detect MC questions where multiple options are mathematically equivalent
// Pattern: options have "X tờ Y.000đ" format - sum them up and find duplicates
const fs = require("fs");
const path = require("path");

const LESSONS = path.join(__dirname, "..", "lib", "lessons.ts");
const src = fs.readFileSync(LESSONS, "utf-8");

// Find all mc() calls with their full body
function findMcCalls(src) {
  const calls = [];
  const re = /\bmc\s*\(/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const start = m.index;
    // Find matching closing paren
    let depth = 1, pos = start + m[0].length;
    while (pos < src.length && depth > 0) {
      if (src[pos] === "(") depth++;
      else if (src[pos] === ")") depth--;
      pos++;
    }
    const body = src.substring(start, pos);
    // Find the 3 quoted strings: id, prompt, correctId
    const quotedRe = /"((?:[^"\\]|\\.)*)"/g;
    const quoted = [];
    let qm;
    while ((qm = quotedRe.exec(body)) !== null) {
      quoted.push(qm);
    }
    if (quoted.length < 3) continue;
    const id = quoted[0][1];
    const prompt = quoted[1][1];
    const correctId = quoted[2][1];
    // Find the array after the 3rd quoted string
    const arrStart = body.indexOf("[", quoted[2].index);
    if (arrStart < 0) continue;
    // Match balanced brackets
    let arrDepth = 1, arrPos = arrStart + 1;
    while (arrPos < body.length && arrDepth > 0) {
      if (body[arrPos] === "[") arrDepth++;
      else if (body[arrPos] === "]") arrDepth--;
      arrPos++;
    }
    const optionsBlock = body.substring(arrStart, arrPos);
    calls.push({ id, correctId, optionsBlock, prompt });
  }
  return calls;
}

const issues = [];

for (const call of findMcCalls(src)) {
  // Extract options
  const optionR = /\{\s*id:\s*"([^"]+)"\s*,\s*label:\s*"((?:[^"\\]|\\.)*)"/g;
  const options = [];
  let om;
  while ((om = optionR.exec(call.optionsBlock)) !== null) {
    options.push({ id: om[1], label: om[2].replace(/\\"/g, '"') });
  }
  // Only process options that contain "tờ" + amount (money combination)
  const sums = [];
  let hasMoneyOptions = false;
  for (const opt of options) {
    if (!/\d+\s+tờ\s+[\d.]+/.test(opt.label)) continue;
    hasMoneyOptions = true;
    let total = 0;
    const matches = [...opt.label.matchAll(/(\d+)\s+tờ\s+(\d+(?:\.\d+)*)(?:đ|000đ)/g)];
    for (const mm of matches) {
      const num = parseInt(mm[1]);
      const denom = parseInt(mm[2].replace(/\./g, ""));
      total += num * denom;
    }
    sums.push({ id: opt.id, label: opt.label, total });
  }
  if (!hasMoneyOptions) continue;

  // Group by total (only consider sums > 0)
  const byTotal = {};
  for (const s of sums) {
    if (s.total <= 0) continue;
    if (!byTotal[s.total]) byTotal[s.total] = [];
    byTotal[s.total].push(s);
  }

  for (const [total, opts] of Object.entries(byTotal)) {
    if (opts.length > 1) {
      issues.push({
        id: call.id,
        prompt: call.prompt,
        total,
        opts,
        correctId: call.correctId,
      });
    }
  }
}

console.log("=== MC Questions with multiple options summing to same amount ===\n");
console.log("⚠️  Cảnh báo: nếu 2+ options có cùng tổng tiền, hỏi có thể có nhiều đáp án đúng.");
console.log("   Note: nếu câu hỏi có constraint (NHIỀU TỜ NHẤT, ÍT TỜ NHẤT, ...) thì cảnh báo là FALSE POSITIVE.");
console.log("   Hãy manual review: nếu constraint rõ ràng, bỏ qua. Nếu không, fix câu hỏi.\n");

if (issues.length === 0) {
  console.log("✓ No ambiguous questions found.");
} else {
  for (const i of issues) {
    console.log(`⚠ ${i.id} (sum = ${parseInt(i.total).toLocaleString()}đ)`);
    console.log(`  Q: ${i.prompt.slice(0, 100)}`);
    for (const o of i.opts) {
      const mark = o.id === i.correctId ? "✓ CORRECT" : "  ALSO CORRECT";
      console.log(`    ${mark}: ${o.label}`);
    }
    console.log("");
  }
}
