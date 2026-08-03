const { numberToVietnamese } = require("./num2vi");
const text = "'Mua xe đạp 2 triệu'";
console.log("Test 1:", text.match(/(\d+)\s*(nghìn|triệu|tỷ)/i));
console.log("Test 2:", text.match(/(\d+)\s+triệu/i));
const out = text.replace(/(\d+)\s*(nghìn|triệu|tỷ)(?=\s|$|[,.!?:'"])/gi, (m, num, unit) => {
  return numberToVietnamese(parseInt(num)) + " " + unit.toLowerCase();
});
console.log("OUT:", out);
