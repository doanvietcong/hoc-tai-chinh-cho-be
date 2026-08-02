import type { Story } from "./types";

/**
 * Storyboards cho tính năng "Pé Ti kể chuyện".
 * Mỗi story là 1 chuỗi scene ngắn — Pé Ti kể + visual props sync.
 * Audio tự động advance khi hết câu.
 */
export const STORIES: Story[] = [
  /* =====================================================
   * SAVING-1: Heo đất — phép màu của kiên trì
   * ===================================================== */
  {
    lessonId: "saving-1",
    title: "Heo đất của Pé Ti",
    estDurationSec: 45,
    scenes: [
      {
        text: "Hôm nay Pé Ti được mẹ cho một chiếc heo đất màu hồng. Pé Ti thích lắm!",
        visual: {
          kind: "spotlight",
          prop: { type: "piggy", coins: 0, mood: "neutral" },
        },
        mood: "happy",
      },
      {
        text: "Mỗi ngày Pé Ti bỏ vào heo 5 nghìn đồng tiền tiêu vặt còn dư.",
        visual: {
          kind: "props",
          items: [
            { type: "piggy", coins: 1, mood: "neutral" },
            { type: "coin", amount: 5, tone: "gold" },
          ],
        },
        mood: "thinking",
      },
      {
        text: "Một tuần trôi qua. Pé Ti đếm: một, hai, ba... 35 nghìn rồi!",
        visual: {
          kind: "props",
          items: [
            { type: "piggy", coins: 7, mood: "happy" },
            { type: "coin", amount: 35, tone: "gold" },
          ],
        },
        mood: "happy",
      },
      {
        text: "Một tháng! Heo đất nặng trĩu. Pé Ti mở ra đếm: 150 nghìn đồng!",
        visual: {
          kind: "props",
          items: [
            { type: "piggy", coins: 30, mood: "rich" },
            { type: "bill", value: 150, tone: "good" },
          ],
        },
        mood: "celebrate",
      },
      {
        text: "Pé Ti học được: tiết kiệm không phải nhịn tiêu, mà là KIÊN TRÌ bỏ từng chút một. Phép màu nằm ở sự kiên trì!",
        visual: {
          kind: "spotlight",
          prop: { type: "piggy", coins: 30, mood: "rich" },
        },
        mood: "wave",
      },
    ],
  },

  /* =====================================================
   * SAVING-4: 3 hũ — phương pháp chia tiền thông minh
   * ===================================================== */
  {
    lessonId: "saving-4",
    title: "Ba hũ thần kỳ",
    estDurationSec: 55,
    scenes: [
      {
        text: "Pé Ti vừa nhận 200 nghìn tiền lì xì Tết. Nhiều quá! Nhưng mẹ nói phải biết chia.",
        visual: {
          kind: "spotlight",
          prop: { type: "coin", amount: 200, tone: "gold" },
        },
        mood: "happy",
      },
      {
        text: "Mẹ đưa cho Pé Ti ba chiếc hũ. Mỗi hũ có một nhiệm vụ riêng.",
        visual: {
          kind: "props",
          items: [
            { type: "jar", label: "TIẾT KIỆM", tone: "save", fillPct: 0 },
            { type: "jar", label: "CHI TIÊU", tone: "spend", fillPct: 0 },
            { type: "jar", label: "CHO ĐI", tone: "give", fillPct: 0 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "Hũ TIẾT KIỆM to nhất: bỏ vào 50 phần trăm, tức 100 nghìn. Đây là tiền để dành dài hạn.",
        visual: {
          kind: "props",
          items: [
            { type: "jar", label: "TIẾT KIỆM", tone: "save", fillPct: 50 },
            { type: "jar", label: "CHI TIÊU", tone: "spend", fillPct: 0 },
            { type: "jar", label: "CHO ĐI", tone: "give", fillPct: 0 },
          ],
        },
        mood: "happy",
      },
      {
        text: "Hũ CHI TIÊU: 40 phần trăm, tức 80 nghìn. Để mua đồ cần thiết và đồ mình thích vừa phải.",
        visual: {
          kind: "props",
          items: [
            { type: "jar", label: "TIẾT KIỆM", tone: "save", fillPct: 50 },
            { type: "jar", label: "CHI TIÊU", tone: "spend", fillPct: 40 },
            { type: "jar", label: "CHO ĐI", tone: "give", fillPct: 0 },
          ],
        },
        mood: "happy",
      },
      {
        text: "Hũ CHO ĐI: 10 phần trăm, tức 20 nghìn. Mua quà sinh nhật bà, giúp đỡ bạn có hoàn cảnh khó.",
        visual: {
          kind: "props",
          items: [
            { type: "jar", label: "TIẾT KIỆM", tone: "save", fillPct: 50 },
            { type: "jar", label: "CHI TIÊU", tone: "spend", fillPct: 40 },
            { type: "jar", label: "CHO ĐI", tone: "give", fillPct: 10 },
          ],
        },
        mood: "celebrate",
      },
      {
        text: "Vậy là mỗi đồng tiền đều có việc làm tốt! Pé Ti vừa TIẾT KIỆM, vừa CHI TIÊU khôn ngoan, lại còn biết CHIA SẺ.",
        visual: {
          kind: "spotlight",
          prop: { type: "jar", label: "CÂN BẰNG", tone: "save", fillPct: 100 },
        },
        mood: "wave",
      },
    ],
  },

  /* =====================================================
   * SAFETY-4: Lập ngân sách — vẽ bản đồ trước khi đi
   * ===================================================== */
  {
    lessonId: "safety-4",
    title: "Bản đồ ngân sách tuần",
    estDurationSec: 55,
    scenes: [
      {
        text: "Đầu tuần, bạn Minh nhận 100 nghìn tiền tiêu vặt. Số tiền này phải dùng cho cả tuần!",
        visual: {
          kind: "spotlight",
          prop: { type: "bill", value: 100, tone: "good" },
        },
        mood: "thinking",
      },
      {
        text: "Minh ngồi xuống vẽ bản đồ tiền: ăn sáng 30 nghìn, đi học 20 nghìn, tiết kiệm 30 nghìn, giải trí 20 nghìn.",
        visual: {
          kind: "spotlight",
          prop: {
            type: "chart-pie",
            segments: [
              { label: "Ăn sáng", value: 30, color: "#fbbf24" },
              { label: "Đi học", value: 20, color: "#60a5fa" },
              { label: "Tiết kiệm", value: 30, color: "#34d399" },
              { label: "Giải trí", value: 20, color: "#f472b6" },
            ],
          },
        },
        mood: "happy",
      },
      {
        text: "Thứ Tư, Minh thấy quán bánh tráng nướng ngon quá. Tiêu thêm 15 nghìn. Nhưng phần 'Giải trí' chỉ có 20 thôi!",
        visual: {
          kind: "spotlight",
          prop: {
            type: "chart-pie",
            segments: [
              { label: "Ăn sáng", value: 30, color: "#fbbf24" },
              { label: "Đi học", value: 20, color: "#60a5fa" },
              { label: "Tiết kiệm", value: 30, color: "#34d399" },
              { label: "Giải trí", value: 35, color: "#f472b6" },
            ],
          },
        },
        mood: "sad",
      },
      {
        text: "Cuối tuần, Minh hết sạch 100 nghìn mà KHÔNG còn gì trong hũ tiết kiệm. Bài học: tiêu vượt hạn mất tiết kiệm!",
        visual: {
          kind: "split",
          left: [
            { type: "jar", label: "MONG MUỐN", tone: "spend", fillPct: 100 },
          ],
          right: [
            { type: "jar", label: "TIẾT KIỆM", tone: "save", fillPct: 0 },
          ],
          leftLabel: "Tiêu hết",
          rightLabel: "Không còn",
        },
        mood: "sad",
      },
      {
        text: "Tuần sau, Minh lập ngân sách TRƯỚC khi tiêu. Cuối tuần còn 30 nghìn bỏ vào heo đất! Thấy chưa, kế hoạch giúp bạn GIÀU hơn!",
        visual: {
          kind: "props",
          items: [
            { type: "piggy", coins: 6, mood: "rich" },
            { type: "coin", amount: 30, tone: "gold" },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * SAFETY-5: Vay lành mạnh — khi nào mượn, mượn thế nào
   * ===================================================== */
  {
    lessonId: "safety-5",
    title: "Câu chuyện vay tiền",
    estDurationSec: 60,
    scenes: [
      {
        text: "Pé Ti muốn mua bộ Lego 200 nghìn, nhưng trong heo đất chỉ có 50 nghìn. Pé Ti buồn lắm!",
        visual: {
          kind: "props",
          items: [
            { type: "piggy", coins: 10, mood: "neutral" },
            { type: "coin", amount: 50, tone: "silver" },
            { type: "emoji", emoji: "🧩", size: 56 },
          ],
        },
        mood: "sad",
      },
      {
        text: "Pé Ti nghĩ: hay là mình VAY tiền để mua đi? Nhưng vay ai, vay thế nào cho AN TOÀN?",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "🤔", size: 100 },
        },
        mood: "thinking",
      },
      {
        text: "Cách 1: Vay mẹ. Mẹ đồng ý cho Pé Ti mượn 150 nghìn, trả góp 25 nghìn mỗi tuần, không tính lãi.",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "👩", size: 60 },
            { type: "bill", value: 25, tone: "good" },
            { type: "coin", amount: 150, tone: "gold" },
          ],
        },
        mood: "happy",
      },
      {
        text: "Cách 2: Vay 'tín dụng đen' ngoài phố. Họ cho mượn NHANH, nhưng lãi suất RẤT CAO. Mỗi tuần phải trả gấp rưỡi!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "😈", size: 60 },
            { type: "bill", value: 100, tone: "bad" },
            { type: "coin", amount: 50, tone: "gold" },
          ],
        },
        mood: "sad",
      },
      {
        text: "Sau 1 tháng: Pé Ti vay mẹ trả xong, còn dư 30 nghìn mua cuốn sách hay. Còn bạn Nam vay 'tín dụng đen' đang nợ gấp đôi!",
        visual: {
          kind: "split",
          left: [
            { type: "emoji", emoji: "😊", size: 80 },
            { type: "coin", amount: 30, tone: "gold" },
          ],
          right: [
            { type: "emoji", emoji: "😰", size: 80 },
            { type: "bill", value: 400, tone: "bad" },
          ],
          leftLabel: "Vay mẹ",
          rightLabel: "Tín dụng đen",
        },
        mood: "thinking",
      },
      {
        text: "Bài học của Pé Ti: chỉ vay khi CẦN THIẾT, có KẾ HOẠCH trả, và chỉ vay người ĐÁNG TIN. Đừng bao giờ vay 'tín dụng đen'!",
        visual: {
          kind: "props",
          items: [
            { type: "shield", tone: "safe" },
            { type: "emoji", emoji: "✅", size: 48 },
          ],
        },
        mood: "celebrate",
      },
    ],
  },
];

/** Lookup helper. */
export function getStoryForLesson(lessonId: string): Story | undefined {
  return STORIES.find((s) => s.lessonId === lessonId);
}
