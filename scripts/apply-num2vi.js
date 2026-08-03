// Apply number → Vietnamese word conversion to stories.ts and lessons.ts
// Only converts in TTS-bound fields (story text, explainer)
const fs = require("fs");
const path = require("path");
const { numberToVietnamese, numberWithUnitToVietnamese } = require("./num2vi");

const STORIES = path.join(__dirname, "..", "lib", "stories.ts");
const LESSONS = path.join(__dirname, "..", "lib", "lessons.ts");

// ----- Convert text with smart rules -----
function convertText(text) {
  if (!text) return text;
  let out = text;

  // 1. Money with đ suffix: 5.000đ, 100.000đ, 1.000.000đ
  out = out.replace(/(\d{1,3}(?:\.\d{3})+)đ/g, (_, num) => numberWithUnitToVietnamese(num, "đ"));

  // 2. Percentage: 10%, 6.5%
  out = out.replace(/(\d+(?:[.,]\d+)?)%/g, (_, num) => {
    if (num.includes(".")) num = num.replace(".", ","); // 6.5% → "sáu phẩy năm phần trăm"
    return numberWithUnitToVietnamese(num, "%");
  });

  // 2b. Percentage as "X phần trăm" (spaced, not %)
  out = out.replace(/\b(\d+)\s+phần\s*trăm\b/gi, (_, num) => numberToVietnamese(parseInt(num)) + " phần trăm");

  // 3. Standalone "X nghìn" / "X triệu" / "X tỷ" (allow decimal, allow apostrophe/quote follow)
  out = out.replace(/(\d+(?:[.,]\d+)?)\s*(nghìn|triệu|tỷ)(?=\s|$|[,.!?:'"])/gi, (m, num, unit) => {
    if (/[a-zA-Z]/.test(num)) return m;
    if (/[.,]/.test(num)) {
      const [int, dec] = num.split(/[.,]/);
      return numberToVietnamese(parseInt(int)) + " phẩy " + numberToVietnamese(parseInt(dec)) + " " + unit.toLowerCase();
    }
    const n = parseInt(num);
    if (isNaN(n)) return m;
    return numberToVietnamese(n) + " " + unit.toLowerCase();
  });

  // 4. Time units: "1 tuần", "5 ngày", "3 tháng", "1 năm", "2 giờ"
  out = out.replace(/\b(\d+)\s+(tuần|ngày|tháng|năm|giờ|phút)(?=\s|$|[,.!?:])/gi, (m, num, unit) => {
    const n = parseInt(num);
    if (isNaN(n)) return m;
    return numberToVietnamese(n) + " " + unit.toLowerCase();
  });

  // 5. Counted nouns: "1 con gà", "2 cái rổ", "5 nải chuối", "10 quả táo"
  out = out.replace(/(\d+)\s+(con|cái|quả|nải|chiếc|tờ|đứa|em|bạn|cây)(?=\s|$|[,.!?:])/g, (m, num, noun) => {
    const n = parseInt(num);
    if (isNaN(n)) return m;
    return numberToVietnamese(n) + " " + noun;
  });

  // 6. Common classifiers: "5 nhu cầu", "3 điều", "1 phần", "3 loại", "5 cách", "2 bước", "1 khoản", "2.5 lần"
  out = out.replace(/(\d+(?:[.,]\d+)?)\s+(nhu cầu|điều|phần|loại|cách|bước|khoản|lần|chỗ|vòng|nhóm|kiểu|dạng|hình thức|phương pháp|công thức)(?=\s|$|[,.!?:])/gi, (m, num, noun) => {
    if (/[.,]/.test(num)) {
      const [int, dec] = num.split(/[.,]/);
      return numberToVietnamese(parseInt(int)) + " phẩy " + numberToVietnamese(parseInt(dec)) + " " + noun.toLowerCase();
    }
    const n = parseInt(num);
    if (isNaN(n)) return m;
    return numberToVietnamese(n) + " " + noun.toLowerCase();
  });

  // 7. "Năm 1:", "Năm 2:" - year markers
  out = out.replace(/\bNăm\s+(\d+)(?=\s|:|$)/g, (_, n) => "Năm " + numberToVietnamese(parseInt(n)));

  // 7b. "Cách 1:", "Bước 2:" - prefix + number + colon
  out = out.replace(/\b(Cách|Bước|Phần|Loại)\s+(\d+)(?=\s|:|$)/g, (_, kw, n) => kw + " " + numberToVietnamese(parseInt(n)));

  // 8. After specific keywords: "chỉ có 20", "với 5", "có 3", etc.
  out = out.replace(/\b(chỉ có|với|có|khoảng|trên|dưới|đến|từ|trong|thêm|được)\s+(\d+)(?=\s|$|[,.!?:])/g, (m, kw, num) => {
    return kw + " " + numberToVietnamese(parseInt(num));
  });

  return out;
}

// ----- Convert stories.ts (only text fields) -----
function convertStories() {
  let src = fs.readFileSync(STORIES, "utf-8");
  let count = 0;
  // Match text: "..." in stories (only the text field, not other strings)
  // text: "...content..."
  src = src.replace(/(\btext:\s*)"((?:[^"\\]|\\.)*)"/g, (m, prefix, content) => {
    const newContent = convertText(content);
    if (newContent !== content) count++;
    return prefix + '"' + newContent + '"';
  });
  fs.writeFileSync(STORIES, src);
  console.log(`✓ stories.ts: converted ${count} text fields`);
  return count;
}

// ----- Convert lessons.ts (only explainer fields) -----
function convertLessons() {
  let src = fs.readFileSync(LESSONS, "utf-8");
  let count = 0;
  // Match explainer: "..."
  src = src.replace(/(\bexplainer:\s*)"((?:[^"\\]|\\.)*)"/g, (m, prefix, content) => {
    const newContent = convertText(content);
    if (newContent !== content) count++;
    return prefix + '"' + newContent + '"';
  });
  fs.writeFileSync(LESSONS, src);
  console.log(`✓ lessons.ts: converted ${count} explainer fields`);
  return count;
}

const total1 = convertStories();
const total2 = convertLessons();
console.log(`\nTotal: ${total1 + total2} fields converted.`);
