// Convert numbers to Vietnamese words in stories.ts and lessons.ts
// Only converts:
//   - text fields in stories.ts (TTS)
//   - explainer fields in lessons.ts (TTS fallback)
// Keeps:
//   - alt/label in image props (display only)
//   - question prompt/statement (display only)
//   - option labels (display only)

const fs = require("fs");
const path = require("path");

const ONES = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const DIGITS = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

function readThreeDigits(n, withZero) {
  // n: 0-999
  // withZero: whether to read leading zeros (e.g., 105 = "một trăm linh năm")
  const hundreds = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;

  let result = "";
  if (hundreds > 0) {
    result += ONES[hundreds] + " trăm";
    if (tens === 0 && ones > 0 && withZero) result += " linh";
  }
  if (tens > 1) {
    result += " " + ONES[tens] + " mươi";
    if (ones > 0) {
      if (ones === 1) result += " mốt";
      else if (ones === 5) result += " lăm";
      else result += " " + ONES[ones];
    }
  } else if (tens === 1) {
    result += " mười";
    if (ones > 0) {
      if (ones === 5) result += " lăm";
      else result += " " + ONES[ones];
    }
  } else if (tens === 0 && ones > 0) {
    if (hundreds > 0) {
      result += " " + ONES[ones];
    } else {
      result += ONES[ones];
    }
  }
  return result.trim();
}

function numberToVietnamese(n) {
  // Convert integer to Vietnamese words
  if (n === 0) return "không";
  if (n < 0) return "âm " + numberToVietnamese(-n);

  const groups = [
    { value: 1_000_000_000, name: "tỷ" },
    { value: 1_000_000, name: "triệu" },
    { value: 1_000, name: "nghìn" },
  ];

  let result = "";
  let remaining = n;

  for (const g of groups) {
    if (remaining >= g.value) {
      const count = Math.floor(remaining / g.value);
      const threeDigit = readThreeDigits(count, false);
      result += threeDigit + " " + g.name + " ";
      remaining = remaining % g.value;
    }
  }

  if (remaining > 0) {
    const lastThree = readThreeDigits(remaining, result.length > 0);
    if (lastThree) result += lastThree;
  }

  return result.trim();
}

function numberWithUnitToVietnamese(numStr, unit) {
  // e.g. "100.000" + "đ" → "một trăm nghìn đồng"
  // e.g. "5.000" + "đ" → "năm nghìn đồng"
  const n = parseInt(numStr.replace(/\./g, ""));
  if (isNaN(n)) return numStr + unit;

  const v = numberToVietnamese(n);
  if (unit === "đ") return v + " đồng";
  if (unit === "%") return v + " phần trăm";
  return v + " " + unit;
}

// Test
const tests = [
  ["1.000", "đ", "một nghìn đồng"],
  ["5.000", "đ", "năm nghìn đồng"],
  ["10.000", "đ", "mười nghìn đồng"],
  ["20.000", "đ", "hai mươi nghìn đồng"],
  ["50.000", "đ", "năm mươi nghìn đồng"],
  ["100.000", "đ", "một trăm nghìn đồng"],
  ["200.000", "đ", "hai trăm nghìn đồng"],
  ["500.000", "đ", "năm trăm nghìn đồng"],
  ["1.000.000", "đ", "một triệu đồng"],
  ["1.500.000", "đ", "một triệu năm trăm nghìn đồng"],
  ["5", "%", "năm phần trăm"],
  ["10", "%", "mười phần trăm"],
  ["50", "%", "năm mươi phần trăm"],
  ["100", "%", "một trăm phần trăm"],
];

for (const [num, unit, expected] of tests) {
  const got = numberWithUnitToVietnamese(num, unit);
  const ok = got === expected ? "✓" : "✗";
  console.log(`${ok} ${num}${unit} → "${got}"${got === expected ? "" : ` (expected: "${expected}")`}`);
}

module.exports = { numberToVietnamese, numberWithUnitToVietnamese };
