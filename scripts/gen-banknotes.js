#!/usr/bin/env node
/**
 * Generate beautiful SVG illustrations of Vietnamese banknotes.
 * 9 denominations: 1k, 2k, 5k, 10k, 20k, 50k, 100k, 200k, 500k.
 *
 * Each note has:
 *   - Distinct color matching real VND polymer note
 *   - Iconic illustration specific to the denomination:
 *       1k  - Chùa Một Cột (blue)
 *       2k  - Nhà sàn Bác Hồ (brown/red-brown)
 *       5k  - Vịnh Hạ Long (rose-pink)
 *       10k - Cầu Long Biên (orange-amber)
 *       20k - Chùa Phổ Minh (cyan-blue)
 *       50k - Phố cổ Hội An (pink)
 *       100k- Văn Miếu - Quốc Tử Giám (green)
 *       200k- Đền Hùng (red-orange)
 *       500k- Phong Nha - Kẻ Bàng (teal)
 *   - Decorative security pattern + watermark
 *   - Star + 国徽 style
 *   - "NGÂN HÀNG NHÀ NƯỚC VIỆT NAM" header
 *   - Real denomination + Vietnamese reading
 */

const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "public", "banknotes");
const W = 440;
const H = 220;

/* ---------- Color schemes (matching real VND notes) ---------- */
const bills = [
  {
    code: "1k", value: "1.000", text: "MỘT NGHÌN ĐỒNG",
    bg1: "#dbeafe", bg2: "#bfdbfe", ink: "#1e3a8a", accent: "#1d4ed8", coin: "#fbbf24",
  },
  {
    code: "2k", value: "2.000", text: "HAI NGHÌN ĐỒNG",
    bg1: "#fed7aa", bg2: "#fdba74", ink: "#7c2d12", accent: "#c2410c", coin: "#fbbf24",
  },
  {
    code: "5k", value: "5.000", text: "NĂM NGHÌN ĐỒNG",
    bg1: "#fecdd3", bg2: "#fda4af", ink: "#881337", accent: "#be123c", coin: "#fbbf24",
  },
  {
    code: "10k", value: "10.000", text: "MƯỜI NGHÌN ĐỒNG",
    bg1: "#fef3c7", bg2: "#fde68a", ink: "#78350f", accent: "#b45309", coin: "#fbbf24",
  },
  {
    code: "20k", value: "20.000", text: "HAI MƯƠI NGHÌN ĐỒNG",
    bg1: "#bae6fd", bg2: "#7dd3fc", ink: "#0c4a6e", accent: "#0369a1", coin: "#fbbf24",
  },
  {
    code: "50k", value: "50.000", text: "NĂM MƯƠI NGHÌN ĐỒNG",
    bg1: "#fbcfe8", bg2: "#f9a8d4", ink: "#831843", accent: "#be185d", coin: "#fbbf24",
  },
  {
    code: "100k", value: "100.000", text: "MỘT TRĂM NGHÌN ĐỒNG",
    bg1: "#bbf7d0", bg2: "#86efac", ink: "#14532d", accent: "#15803d", coin: "#fbbf24",
  },
  {
    code: "200k", value: "200.000", text: "HAI TRĂM NGHÌN ĐỒNG",
    bg1: "#fed7aa", bg2: "#fb923c", ink: "#7c2d12", accent: "#c2410c", coin: "#fbbf24",
  },
  {
    code: "500k", value: "500.000", text: "NĂM TRĂM NGHÌN ĐỒNG",
    bg1: "#a5f3fc", bg2: "#67e8f9", ink: "#155e75", accent: "#0e7490", coin: "#fbbf24",
  },
];

/* ---------- Per-denomination icon SVGs (drawn at fixed position) ---------- */
const icons = {
  /* 1k - Chùa Một Cột */
  "1k": `
    <g transform="translate(220, 120)">
      <!-- pillar -->
      <rect x="-3" y="10" width="6" height="50" fill="${"#7c2d12"}"/>
      <!-- base pond -->
      <ellipse cx="0" cy="62" rx="38" ry="6" fill="#1e40af" opacity="0.4"/>
      <!-- roof -->
      <path d="M -34 10 L 34 10 L 28 -2 L -28 -2 Z" fill="#dc2626" stroke="${"#7c2d12"}" stroke-width="1"/>
      <path d="M -28 -2 L 28 -2 L 24 -10 L -24 -10 Z" fill="#b91c1c" stroke="${"#7c2d12"}" stroke-width="1"/>
      <path d="M -24 -10 L 24 -10 L 18 -18 L -18 -18 Z" fill="#991b1b" stroke="${"#7c2d12"}" stroke-width="1"/>
      <!-- top finial -->
      <circle cx="0" cy="-22" r="3" fill="#fbbf24"/>
      <line x1="0" y1="-22" x2="0" y2="-30" stroke="#fbbf24" stroke-width="1.5"/>
      <!-- body -->
      <rect x="-20" y="-2" width="40" height="14" fill="#fef3c7" stroke="${"#7c2d12"}" stroke-width="1"/>
      <rect x="-15" y="2" width="30" height="8" fill="#dc2626" opacity="0.6"/>
    </g>
  `,
  /* 2k - Nhà sàn (stilt house) */
  "2k": `
    <g transform="translate(220, 120)">
      <!-- stilts -->
      <rect x="-32" y="14" width="4" height="48" fill="#7c2d12"/>
      <rect x="-12" y="14" width="4" height="48" fill="#7c2d12"/>
      <rect x="8" y="14" width="4" height="48" fill="#7c2d12"/>
      <rect x="28" y="14" width="4" height="48" fill="#7c2d12"/>
      <!-- floor -->
      <rect x="-40" y="14" width="80" height="6" fill="#a16207"/>
      <!-- house body -->
      <rect x="-36" y="-12" width="72" height="26" fill="#fed7aa" stroke="#7c2d12" stroke-width="1.5"/>
      <!-- roof -->
      <path d="M -42 -12 L 42 -12 L 36 -28 L -36 -28 Z" fill="#9a3412" stroke="#7c2d12" stroke-width="1.5"/>
      <path d="M -36 -28 L 36 -28 L 0 -44 Z" fill="#7c2d12" stroke="#7c2d12" stroke-width="1.5"/>
      <!-- door + window -->
      <rect x="-8" y="-2" width="10" height="16" fill="#7c2d12"/>
      <rect x="14" y="-4" width="14" height="10" fill="#fef3c7" stroke="#7c2d12" stroke-width="1"/>
      <line x1="21" y1="-4" x2="21" y2="6" stroke="#7c2d12" stroke-width="0.8"/>
      <line x1="14" y1="1" x2="28" y2="1" stroke="#7c2d12" stroke-width="0.8"/>
      <!-- ground -->
      <ellipse cx="0" cy="64" rx="50" ry="4" fill="#15803d" opacity="0.5"/>
    </g>
  `,
  /* 5k - Vịnh Hạ Long (karst islands) */
  "5k": `
    <g transform="translate(220, 130)">
      <!-- water -->
      <path d="M -60 18 Q -30 12, 0 18 T 60 18 L 60 32 L -60 32 Z" fill="#0ea5e9" opacity="0.5"/>
      <path d="M -50 24 Q -20 20, 10 24 T 60 24" stroke="#fff" stroke-width="1" fill="none" opacity="0.5"/>
      <!-- big karst -->
      <path d="M -40 18 Q -36 -28, -22 -32 Q -10 -34, -8 0 Q -6 12, -2 18 Z" fill="#15803d" stroke="#14532d" stroke-width="1"/>
      <path d="M -28 -10 Q -22 -16, -18 -10" fill="none" stroke="#bbf7d0" stroke-width="1"/>
      <!-- middle karst -->
      <path d="M 0 18 Q -2 -22, 8 -28 Q 18 -30, 22 0 Q 24 10, 26 18 Z" fill="#16a34a" stroke="#14532d" stroke-width="1"/>
      <path d="M 8 -12 Q 12 -18, 16 -12" fill="none" stroke="#bbf7d0" stroke-width="1"/>
      <!-- right karst -->
      <path d="M 28 18 Q 30 -18, 40 -22 Q 50 -24, 54 4 Q 56 12, 58 18 Z" fill="#15803d" stroke="#14532d" stroke-width="1"/>
      <path d="M 42 -8 Q 46 -12, 50 -8" fill="none" stroke="#bbf7d0" stroke-width="1"/>
      <!-- junk boat -->
      <path d="M -16 22 L 8 22 L 6 26 L -14 26 Z" fill="#7c2d12"/>
      <rect x="-6" y="16" width="3" height="6" fill="#7c2d12"/>
    </g>
  `,
  /* 10k - Cầu Long Biên (long bien bridge) */
  "10k": `
    <g transform="translate(220, 130)">
      <!-- river -->
      <path d="M -70 30 Q -35 26, 0 30 T 70 30 L 70 50 L -70 50 Z" fill="#0284c7" opacity="0.4"/>
      <!-- bridge deck -->
      <rect x="-65" y="18" width="130" height="4" fill="#7c2d12"/>
      <!-- arches -->
      <path d="M -60 22 Q -50 36, -40 22" fill="none" stroke="#7c2d12" stroke-width="2"/>
      <path d="M -40 22 Q -30 36, -20 22" fill="none" stroke="#7c2d12" stroke-width="2"/>
      <path d="M -20 22 Q -10 36, 0 22" fill="none" stroke="#7c2d12" stroke-width="2"/>
      <path d="M 0 22 Q 10 36, 20 22" fill="none" stroke="#7c2d12" stroke-width="2"/>
      <path d="M 20 22 Q 30 36, 40 22" fill="none" stroke="#7c2d12" stroke-width="2"/>
      <path d="M 40 22 Q 50 36, 60 22" fill="none" stroke="#7c2d12" stroke-width="2"/>
      <!-- trusses -->
      <line x1="-65" y1="18" x2="-60" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="-50" y1="18" x2="-50" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="-40" y1="18" x2="-40" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="-30" y1="18" x2="-30" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="-20" y1="18" x2="-20" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="-10" y1="18" x2="-10" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="0" y1="18" x2="0" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="10" y1="18" x2="10" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="20" y1="18" x2="20" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="30" y1="18" x2="30" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="40" y1="18" x2="40" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="50" y1="18" x2="50" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <line x1="60" y1="18" x2="60" y2="2" stroke="#7c2d12" stroke-width="1"/>
      <!-- top chord -->
      <line x1="-65" y1="2" x2="65" y2="2" stroke="#7c2d12" stroke-width="1.5"/>
    </g>
  `,
  /* 20k - Chùa Phổ Minh (multi-tier pagoda) */
  "20k": `
    <g transform="translate(220, 125)">
      <!-- base -->
      <rect x="-30" y="20" width="60" height="8" fill="#0c4a6e"/>
      <rect x="-32" y="14" width="64" height="6" fill="#075985"/>
      <!-- 1st tier body -->
      <rect x="-22" y="-2" width="44" height="16" fill="#fef3c7" stroke="#0c4a6e" stroke-width="1"/>
      <rect x="-18" y="2" width="36" height="10" fill="#0369a1" opacity="0.5"/>
      <!-- 1st tier roof -->
      <path d="M -28 -2 L 28 -2 L 24 -10 L -24 -10 Z" fill="#dc2626" stroke="#0c4a6e" stroke-width="1"/>
      <path d="M -24 -10 L 24 -10 L 18 -18 L -18 -18 Z" fill="#b91c1c" stroke="#0c4a6e" stroke-width="1"/>
      <!-- 2nd tier body -->
      <rect x="-16" y="-26" width="32" height="14" fill="#fef3c7" stroke="#0c4a6e" stroke-width="1"/>
      <!-- 2nd tier roof -->
      <path d="M -20 -26 L 20 -26 L 16 -32 L -16 -32 Z" fill="#dc2626" stroke="#0c4a6e" stroke-width="1"/>
      <path d="M -16 -32 L 16 -32 L 10 -38 L -10 -38 Z" fill="#b91c1c" stroke="#0c4a6e" stroke-width="1"/>
      <!-- 3rd tier -->
      <rect x="-10" y="-46" width="20" height="10" fill="#fef3c7" stroke="#0c4a6e" stroke-width="1"/>
      <path d="M -13 -46 L 13 -46 L 9 -52 L -9 -52 Z" fill="#dc2626" stroke="#0c4a6e" stroke-width="1"/>
      <!-- top finial -->
      <line x1="0" y1="-52" x2="0" y2="-62" stroke="#fbbf24" stroke-width="1.5"/>
      <circle cx="0" cy="-64" r="3" fill="#fbbf24"/>
    </g>
  `,
  /* 50k - Phố cổ Hội An (ancient town with lantern) */
  "50k": `
    <g transform="translate(220, 130)">
      <!-- ground -->
      <rect x="-60" y="28" width="120" height="6" fill="#831843" opacity="0.3"/>
      <!-- left house -->
      <rect x="-50" y="0" width="34" height="28" fill="#fef3c7" stroke="#831843" stroke-width="1.2"/>
      <path d="M -54 0 L 38 0 L 32 -10 L -48 -10 Z" fill="#9d174d" stroke="#831843" stroke-width="1.2"/>
      <rect x="-44" y="6" width="8" height="10" fill="#831843"/>
      <rect x="-32" y="6" width="8" height="10" fill="#831843"/>
      <rect x="-20" y="6" width="8" height="10" fill="#831843"/>
      <!-- middle house -->
      <rect x="-12" y="-6" width="28" height="34" fill="#fed7aa" stroke="#831843" stroke-width="1.2"/>
      <path d="M -16 -6 L 20 -6 L 14 -16 L -10 -16 Z" fill="#9d174d" stroke="#831843" stroke-width="1.2"/>
      <rect x="-6" y="0" width="8" height="14" fill="#831843"/>
      <rect x="4" y="0" width="8" height="14" fill="#831843"/>
      <!-- right house -->
      <rect x="22" y="0" width="32" height="28" fill="#fef3c7" stroke="#831843" stroke-width="1.2"/>
      <path d="M 18 0 L 58 0 L 52 -10 L 24 -10 Z" fill="#9d174d" stroke="#831843" stroke-width="1.2"/>
      <rect x="28" y="6" width="8" height="10" fill="#831843"/>
      <rect x="40" y="6" width="8" height="10" fill="#831843"/>
      <!-- hanging lantern -->
      <line x1="2" y1="-20" x2="2" y2="-12" stroke="#831843" stroke-width="0.8"/>
      <ellipse cx="2" cy="-8" rx="6" ry="8" fill="#fbbf24" stroke="#831843" stroke-width="1"/>
      <line x1="-4" y1="-8" x2="8" y2="-8" stroke="#831843" stroke-width="0.5"/>
      <line x1="-4" y1="-4" x2="8" y2="-4" stroke="#831843" stroke-width="0.5"/>
      <line x1="-2" y1="-16" x2="6" y2="-16" stroke="#831843" stroke-width="0.5"/>
    </g>
  `,
  /* 100k - Văn Miếu (temple of literature - gate) */
  "100k": `
    <g transform="translate(220, 125)">
      <!-- base -->
      <rect x="-50" y="20" width="100" height="10" fill="#14532d"/>
      <!-- main hall -->
      <rect x="-40" y="-6" width="80" height="26" fill="#fef3c7" stroke="#14532d" stroke-width="1.5"/>
      <!-- 3 doors -->
      <rect x="-32" y="2" width="14" height="18" fill="#14532d"/>
      <rect x="-7" y="2" width="14" height="18" fill="#14532d"/>
      <rect x="18" y="2" width="14" height="18" fill="#14532d"/>
      <!-- roof tier 1 -->
      <path d="M -48 -6 L 48 -6 L 42 -16 L -42 -16 Z" fill="#15803d" stroke="#14532d" stroke-width="1.5"/>
      <path d="M -42 -16 L 42 -16 L 36 -24 L -36 -24 Z" fill="#166534" stroke="#14532d" stroke-width="1.5"/>
      <!-- roof tier 2 -->
      <path d="M -34 -24 L 34 -24 L 28 -32 L -28 -32 Z" fill="#15803d" stroke="#14532d" stroke-width="1.5"/>
      <path d="M -28 -32 L 28 -32 L 20 -40 L -20 -40 Z" fill="#166534" stroke="#14532d" stroke-width="1.5"/>
      <!-- top finial -->
      <line x1="0" y1="-40" x2="0" y2="-50" stroke="#fbbf24" stroke-width="1.5"/>
      <circle cx="0" cy="-52" r="3" fill="#fbbf24"/>
    </g>
  `,
  /* 200k - Đền Hùng (temple on hill) */
  "200k": `
    <g transform="translate(220, 130)">
      <!-- mountain base -->
      <path d="M -70 32 Q -50 10, -20 18 Q 0 22, 30 14 Q 60 8, 70 32 Z" fill="#15803d" stroke="#14532d" stroke-width="1.5"/>
      <!-- steps up -->
      <path d="M -8 32 L -2 14 L 2 14 L 8 32 Z" fill="#a16207"/>
      <!-- main temple -->
      <rect x="-12" y="-6" width="24" height="18" fill="#fef3c7" stroke="#7c2d12" stroke-width="1.2"/>
      <rect x="-4" y="0" width="8" height="12" fill="#7c2d12"/>
      <!-- roof -->
      <path d="M -16 -6 L 16 -6 L 12 -14 L -12 -14 Z" fill="#dc2626" stroke="#7c2d12" stroke-width="1.2"/>
      <path d="M -12 -14 L 12 -14 L 6 -22 L -6 -22 Z" fill="#b91c1c" stroke="#7c2d12" stroke-width="1.2"/>
      <!-- finial -->
      <line x1="0" y1="-22" x2="0" y2="-32" stroke="#fbbf24" stroke-width="1.5"/>
      <circle cx="0" cy="-34" r="2.5" fill="#fbbf24"/>
      <!-- side trees -->
      <circle cx="-32" cy="22" r="6" fill="#16a34a"/>
      <circle cx="32" cy="22" r="6" fill="#16a34a"/>
    </g>
  `,
  /* 500k - Phong Nha - Kẻ Bàng (cave/mountain) */
  "500k": `
    <g transform="translate(220, 130)">
      <!-- big mountain -->
      <path d="M -60 30 L -30 -30 L -10 -10 L 10 -34 L 30 -8 L 50 -28 L 60 30 Z" fill="#0e7490" stroke="#155e75" stroke-width="1.5"/>
      <!-- cave opening -->
      <path d="M -14 30 L -2 -4 L 0 -2 L 14 30 Z" fill="#0c4a6e"/>
      <ellipse cx="0" cy="6" rx="4" ry="8" fill="#fbbf24" opacity="0.6"/>
      <!-- highlights -->
      <path d="M -28 -22 L -20 -8" stroke="#67e8f9" stroke-width="1" fill="none"/>
      <path d="M 14 -22 L 22 -8" stroke="#67e8f9" stroke-width="1" fill="none"/>
      <!-- water -->
      <path d="M -60 30 L 60 30 L 60 38 L -60 38 Z" fill="#0891b2" opacity="0.5"/>
      <path d="M -40 34 Q -20 32, 0 34 T 40 34" stroke="#67e8f9" stroke-width="1" fill="none" opacity="0.7"/>
      <!-- tiny boat -->
      <path d="M -22 32 L -10 32 L -12 36 L -20 36 Z" fill="#7c2d12"/>
    </g>
  `,
};

/* ---------- Star / 国徽 style ornament ---------- */
function bigStar(ink) {
  return `
    <g transform="translate(0,0)">
      <circle r="14" fill="#fbbf24" stroke="${ink}" stroke-width="1.5"/>
      <path d="M 0 -10 L 2.5 -3 L 9 -3 L 4 1.5 L 6 9 L 0 5 L -6 9 L -4 1.5 L -9 -3 L -2.5 -3 Z" fill="${ink}"/>
    </g>
  `;
}

/* ---------- Build SVG ---------- */
function svg(b) {
  const { code, value, text, bg1, bg2, ink, accent, coin } = b;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg-${code}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <pattern id="pat-${code}" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
      <path d="M 7 0 L 8 6 L 14 7 L 8 8 L 7 14 L 6 8 L 0 7 L 6 6 Z" fill="${ink}" opacity="0.06"/>
    </pattern>
    <pattern id="lines-${code}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <line x1="0" y1="20" x2="40" y2="20" stroke="${ink}" stroke-width="0.4" opacity="0.15"/>
      <line x1="20" y1="0" x2="20" y2="40" stroke="${ink}" stroke-width="0.4" opacity="0.15"/>
    </pattern>
    <radialGradient id="shine-${code}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- base -->
  <rect width="${W}" height="${H}" rx="12" fill="url(#bg-${code})"/>
  <rect width="${W}" height="${H}" rx="12" fill="url(#pat-${code})"/>
  <rect width="${W}" height="${H}" rx="12" fill="url(#lines-${code})"/>
  <ellipse cx="${W / 2}" cy="${H / 2}" rx="${W / 2}" ry="${H / 2}" fill="url(#shine-${code})"/>

  <!-- outer border (decorative) -->
  <rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="9" fill="none" stroke="${ink}" stroke-width="1.5" opacity="0.5"/>
  <rect x="8" y="8" width="${W - 16}" height="${H - 16}" rx="7" fill="none" stroke="${ink}" stroke-width="0.6" stroke-dasharray="3,2" opacity="0.4"/>

  <!-- corner ornaments -->
  <g fill="${accent}" opacity="0.85">
    <path d="M 16 16 L 18 21 L 23 21 L 19 24 L 21 29 L 16 26 L 11 29 L 13 24 L 9 21 L 14 21 Z"/>
    <path d="M ${W - 16} 16 L ${W - 14} 21 L ${W - 9} 21 L ${W - 13} 24 L ${W - 11} 29 L ${W - 16} 26 L ${W - 21} 29 L ${W - 19} 24 L ${W - 23} 21 L ${W - 18} 21 Z"/>
    <path d="M 16 ${H - 16} L 18 ${H - 21} L 23 ${H - 21} L 19 ${H - 24} L 21 ${H - 29} L 16 ${H - 26} L 11 ${H - 29} L 13 ${H - 24} L 9 ${H - 21} L 14 ${H - 21} Z"/>
    <path d="M ${W - 16} ${H - 16} L ${W - 14} ${H - 21} L ${W - 9} ${H - 21} L ${W - 13} ${H - 24} L ${W - 11} ${H - 29} L ${W - 16} ${H - 26} L ${W - 21} ${H - 29} L ${W - 19} ${H - 24} L ${W - 23} ${H - 21} L ${W - 18} ${H - 21} Z"/>
  </g>

  <!-- header -->
  <text x="${W / 2}" y="26" text-anchor="middle" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="11" font-weight="800" fill="${ink}" letter-spacing="1.4">NGÂN HÀNG NHÀ NƯỚC VIỆT NAM</text>

  <!-- 国徽 style star (left) -->
  <g transform="translate(48, 60)">${bigStar(ink).trim()}</g>
  <text x="48" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="${ink}" letter-spacing="0.5">★</text>
  <text x="48" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="${ink}" letter-spacing="0.5">★</text>
  <text x="48" y="110" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="${ink}" letter-spacing="0.5">★</text>
  <text x="48" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="${ink}" letter-spacing="0.5">★</text>

  <!-- 国徽 style star (right) -->
  <g transform="translate(${W - 48}, 60)">${bigStar(ink).trim()}</g>
  <text x="${W - 48}" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="${ink}" letter-spacing="0.5">★</text>
  <text x="${W - 48}" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="${ink}" letter-spacing="0.5">★</text>
  <text x="${W - 48}" y="110" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="${ink}" letter-spacing="0.5">★</text>
  <text x="${W - 48}" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="${ink}" letter-spacing="0.5">★</text>

  <!-- central iconic illustration -->
  <g>${icons[code]}</g>

  <!-- big denomination number watermark (subtle) -->
  <text x="${W / 2}" y="200" text-anchor="middle" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="46" font-weight="900" fill="${ink}" opacity="0.18">${value}</text>

  <!-- bottom text -->
  <text x="${W / 2}" y="${H - 8}" text-anchor="middle" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="10" font-weight="800" fill="${ink}" letter-spacing="2" opacity="0.9">${text}</text>

  <!-- side number copies (small, near star) -->
  <text x="76" y="64" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="14" font-weight="800" fill="${ink}">${value}</text>
  <text x="${W - 76}" y="64" text-anchor="end" font-family="'Be Vietnam Pro', Arial, sans-serif" font-size="14" font-weight="800" fill="${ink}">${value}</text>

  <!-- coin glyph next to numbers -->
  <g transform="translate(76, 80)">
    <circle r="7" fill="${coin}" stroke="${ink}" stroke-width="1"/>
    <text y="3" text-anchor="middle" font-family="serif" font-size="9" font-weight="900" fill="${ink}">₫</text>
  </g>
  <g transform="translate(${W - 76}, 80)">
    <circle r="7" fill="${coin}" stroke="${ink}" stroke-width="1"/>
    <text y="3" text-anchor="middle" font-family="serif" font-size="9" font-weight="900" fill="${ink}">₫</text>
  </g>

  <!-- fine serial number -->
  <text x="${W / 2}" y="${H - 22}" text-anchor="middle" font-family="monospace" font-size="7" font-weight="600" fill="${ink}" opacity="0.55" letter-spacing="2">SB${code.toUpperCase()}-${Math.floor(Math.random() * 900000 + 100000)}</text>
</svg>
`;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const b of bills) {
    const out = path.join(OUT_DIR, `${b.code}.svg`);
    fs.writeFileSync(out, svg(b), "utf-8");
    console.log(`  ✓ ${b.code}.svg`);
  }
  // Remove old PNG/JPG if we have SVG versions
  for (const b of bills) {
    for (const ext of [".jpg", ".png", ".jpeg", ".webp"]) {
      const old = path.join(OUT_DIR, `${b.code}${ext}`);
      if (fs.existsSync(old)) {
        fs.unlinkSync(old);
        console.log(`  - removed old ${b.code}${ext}`);
      }
    }
  }
  console.log(`\n✓ Generated ${bills.length} SVG banknotes in ${OUT_DIR}`);
}

main();
