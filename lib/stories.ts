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
      {
        text: "Bạn cũng thử nhé: mỗi ngày bỏ vào heo một chút, rồi xem phép màu xảy ra!",
        visual: {
          kind: "props",
          items: [
            { type: "piggy", coins: 30, mood: "rich" },
            { type: "sparkle" },
          ],
        },
        mood: "celebrate",
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
      {
        text: "Bạn thử lấy 3 chiếc hũ thật ở nhà và chia tiền tiêu vặt vào nhé! Sẽ thấy mình GIÀU lên từng ngày đó!",
        visual: {
          kind: "props",
          items: [
            { type: "jar", label: "TIẾT KIỆM", tone: "save", fillPct: 100 },
            { type: "jar", label: "CHI TIÊU", tone: "spend", fillPct: 100 },
            { type: "jar", label: "CHO ĐI", tone: "give", fillPct: 100 },
            { type: "sparkle" },
          ],
        },
        mood: "celebrate",
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
            { type: "sparkle" },
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
            { type: "sparkle" },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * MONEY-1: Tiền đến từ đâu
   * ===================================================== */
  {
    lessonId: "money-1",
    title: "Tiền từ đâu ra?",
    estDurationSec: 25,
    scenes: [
      {
        text: "Pé Ti tự hỏi: tiền ở đâu ra nhỉ? Có phải ở cây tiền không?",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "🤔", size: 100 },
        },
        mood: "thinking",
      },
      {
        text: "Ngân hàng Nhà nước Việt Nam là nơi IN tiền. Mỗi tờ tiền đều có hình lãnh tụ và phong cảnh đất nước.",
        visual: {
          kind: "spotlight",
          prop: { type: "bank", label: "NHNN Việt Nam" },
        },
        mood: "happy",
      },
      {
        text: "Ngày xưa chưa có tiền, người Việt đổi hàng bằng vỏ sò, muối. Sau đó mới có tiền xu, rồi tiền giấy!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🐚", size: 60 },
            { type: "emoji", emoji: "🧂", size: 60 },
            { type: "coin", amount: 1, tone: "gold" },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * MONEY-2: Làm quen với tờ tiền
   * ===================================================== */
  {
    lessonId: "money-2",
    title: "Đếm tiền vui",
    estDurationSec: 25,
    scenes: [
      {
        text: "Tiền Việt Nam có nhiều mệnh giá: 1 nghìn, 2 nghìn, 5 nghìn, 10 nghìn, 20 nghìn, 50 nghìn, 100 nghìn, 200 nghìn, 500 nghìn!",
        visual: {
          kind: "props",
          items: [
            { type: "bill", value: 1, tone: "good" },
            { type: "bill", value: 5, tone: "good" },
            { type: "bill", value: 10, tone: "good" },
            { type: "bill", value: 50, tone: "good" },
          ],
        },
        mood: "happy",
      },
      {
        text: "Tờ 500 nghìn màu đỏ cam, tờ 200 nghìn màu nâu, tờ 100 nghìn màu xanh lá. Mỗi tờ có màu riêng!",
        visual: {
          kind: "spotlight",
          prop: { type: "bill", value: 500, tone: "good" },
        },
        mood: "thinking",
      },
      {
        text: "Bạn nhận 50 nghìn, mua kem 15 nghìn, người bán trả lại bạn 35 nghìn. Đếm tiền thừa là kỹ năng quan trọng!",
        visual: {
          kind: "props",
          items: [
            { type: "bill", value: 50, tone: "good" },
            { type: "coin", amount: 15, tone: "gold" },
            { type: "coin", amount: 35, tone: "gold" },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * MONEY-3: Tiền dùng để làm gì
   * ===================================================== */
  {
    lessonId: "money-3",
    title: "Tiền làm được gì?",
    estDurationSec: 25,
    scenes: [
      {
        text: "Tiền dùng để MUA ĐỒ cần thiết: cơm, sách vở, áo quần. Không có tiền thì khó sống lắm!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🍚", size: 60 },
            { type: "emoji", emoji: "📚", size: 60 },
            { type: "emoji", emoji: "👕", size: 60 },
            { type: "coin", amount: 50, tone: "gold" },
          ],
        },
        mood: "thinking",
      },
      {
        text: "Tiền còn dùng để TIẾT KIỆM cho tương lai, hoặc CHO ĐI giúp bạn bè. Tiền là công cụ, mình là người sử dụng!",
        visual: {
          kind: "props",
          items: [
            { type: "piggy", coins: 5, mood: "happy" },
            { type: "emoji", emoji: "🎁", size: 60 },
            { type: "emoji", emoji: "💝", size: 60 },
          ],
        },
        mood: "happy",
      },
      {
        text: "NHƯNG nhớ nhé: tiền không mua được tình yêu thương, sức khỏe và niềm vui. Đó mới là điều QUAN TRỌNG NHẤT!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "❤️", size: 60 },
            { type: "emoji", emoji: "😊", size: 60 },
            { type: "emoji", emoji: "🌟", size: 60 },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * NEEDS-1: Nhu cầu là gì
   * ===================================================== */
  {
    lessonId: "needs-1",
    title: "Cái gì mình CẦN?",
    estDurationSec: 25,
    scenes: [
      {
        text: "Nhu cầu là thứ mình CẦN để sống: cơm để không đói, nước để không khát, nhà để không lạnh.",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🍚", size: 60 },
            { type: "emoji", emoji: "💧", size: 60 },
            { type: "emoji", emoji: "🏠", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "Còn có: áo quần để mặc, sách vở để học, thuốc khi ốm. Đây là 5 nhu cầu cơ bản của con người!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "👕", size: 60 },
            { type: "emoji", emoji: "📚", size: 60 },
            { type: "emoji", emoji: "💊", size: 60 },
          ],
        },
        mood: "happy",
      },
      {
        text: "Bạn nhớ nhé: NHU CẦU = thứ mình cần. Nếu thiếu thì khó sống hoặc sống không tốt. Còn thứ mình MUỐN thì không cần thiết phải có ngay!",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "💡", size: 100 },
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * NEEDS-2: Khác biệt nhu cầu - mong muốn
   * ===================================================== */
  {
    lessonId: "needs-2",
    title: "Cần vs Muốn",
    estDurationSec: 25,
    scenes: [
      {
        text: "CƠM là NHU CẦU - không ăn thì đói, không thể thiếu!",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "🍚", size: 100 },
        },
        mood: "thinking",
      },
      {
        text: "KEM là MONG MUỐN - thích thì ăn, không ăn vẫn sống được! Cả hai đều tốt, nhưng khác nhau.",
        visual: {
          kind: "split",
          left: [
            { type: "emoji", emoji: "🍚", size: 80 },
          ],
          right: [
            { type: "emoji", emoji: "🍦", size: 80 },
          ],
          leftLabel: "NHU CẦU",
          rightLabel: "MONG MUỐN",
        },
        mood: "thinking",
      },
      {
        text: "Bí quyết: trước khi mua, hỏi 'Mình CẦN cái này không?' Nếu không cần, hãy chờ vài ngày. Nếu vẫn thích thì mua!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🤔", size: 60 },
            { type: "emoji", emoji: "⏰", size: 60 },
            { type: "emoji", emoji: "💖", size: 60 },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * NEEDS-3: Cách chọn thông minh
   * ===================================================== */
  {
    lessonId: "needs-3",
    title: "Chọn đồ thông minh",
    estDurationSec: 25,
    scenes: [
      {
        text: "Bạn có 100 nghìn. Bạn muốn mua: kem 20k, bút chì màu 30k, truyện tranh 50k.",
        visual: {
          kind: "props",
          items: [
            { type: "coin", amount: 100, tone: "gold" },
            { type: "emoji", emoji: "🍦", size: 50 },
            { type: "emoji", emoji: "✏️", size: 50 },
            { type: "emoji", emoji: "📖", size: 50 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "Bút chì màu phục vụ HỌC TẬP - cần cho việc học. Truyện tranh thì vui nhưng không cần. Kem là mong muốn.",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "✅", size: 60 },
            { type: "emoji", emoji: "✏️", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "Chọn thông minh: mua bút chì màu 30k (cần cho học), còn 70k tiết kiệm dần! Thế là VỪA ĐỦ mà KHÔNG LÃNG PHÍ.",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "✏️", size: 60 },
            { type: "piggy", coins: 7, mood: "happy" },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * SAVING-2: Mục tiêu SMART
   * ===================================================== */
  {
    lessonId: "saving-2",
    title: "Mục tiêu SMART",
    estDurationSec: 30,
    scenes: [
      {
        text: "Pé Ti muốn mua xe đạp 2 triệu. Nhưng tiết kiệm kiểu gì cho đủ? Mẹ nói: lập mục tiêu SMART!",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "🚲", size: 100 },
        },
        mood: "thinking",
      },
      {
        text: "S - Cụ thể: 'Mua xe đạp 2 triệu'. M - Đo được: biết chínhá xác bao nhiêu tiền. A - Khả thi: tiết kiệm được.",
        visual: {
          kind: "props",
          items: [
            { type: "bill", value: 2000, tone: "good" },
            { type: "emoji", emoji: "📏", size: 60 },
            { type: "emoji", emoji: "✅", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "R - Thực tế: mỗi tháng tiết kiệm được 200k. T - Thời hạn: trong 10 tháng. SMART = mục tiêu RÕ RÀNG!",
        visual: {
          kind: "props",
          items: [
            { type: "coin", amount: 200, tone: "gold" },
            { type: "emoji", emoji: "📅", size: 60 },
            { type: "emoji", emoji: "🎯", size: 60 },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * SAVING-3: Lãi kép - tiền đẻ tiền
   * ===================================================== */
  {
    lessonId: "saving-3",
    title: "Tiền đẻ ra tiền",
    estDurationSec: 30,
    scenes: [
      {
        text: "Pé Ti gửi heo 100 nghìn. Sau 1 năm mẹ thưởng thêm 10% là 10 nghìn. Tổng: 110 nghìn!",
        visual: {
          kind: "spotlight",
          prop: { type: "piggy", coins: 10, mood: "happy" },
        },
        mood: "thinking",
      },
      {
        text: "Năm sau, 10% của 110 nghìn = 11 nghìn. Tổng 121 nghìn! Tiền CŨ cũng sinh ra tiền MỚI. Đó gọi là LÃI KÉP!",
        visual: {
          kind: "spotlight",
          prop: { type: "tree", size: 50 },
        },
        mood: "happy",
      },
      {
        text: "Càng để lâu, tiền càng nhiều! 100 nghìn sau 5 năm có thể thành 161 nghìn. Thần kỳ chưa nào?",
        visual: {
          kind: "spotlight",
          prop: { type: "tree", size: 90 },
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * EARNING-1: Tiền đến từ đâu (kiếm tiền)
   * ===================================================== */
  {
    lessonId: "earning-1",
    title: "Tiền từ đâu ra?",
    estDurationSec: 25,
    scenes: [
      {
        text: "Bạn thắc mắc: 'Bố mẹ lấy tiền ở đâu?' Câu trả lời là: BỐ MẸ ĐI LÀM và nhận LƯƠNG.",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "👨‍💼", size: 60 },
            { type: "emoji", emoji: "👩‍🏫", size: 60 },
            { type: "bill", value: 5000, tone: "good" },
          ],
        },
        mood: "thinking",
      },
      {
        text: "Mỗi tháng bố mẹ làm việc, công ty trả lương. Tiền lương dùng để mua thức ăn, nhà cửa, quần áo, sách vở cho cả nhà!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🍚", size: 50 },
            { type: "emoji", emoji: "🏠", size: 50 },
            { type: "emoji", emoji: "📚", size: 50 },
            { type: "emoji", emoji: "👕", size: 50 },
          ],
        },
        mood: "happy",
      },
      {
        text: "Tiền không tự sinh ra. Bố mẹ phải LÀM VIỆC mới có tiền. Vậy nên mình phải biết TRÂN TRỌNG từng đồng nhé!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "💪", size: 60 },
            { type: "emoji", emoji: "❤️", size: 60 },
            { type: "coin", amount: 1, tone: "gold" },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * EARNING-2: Lao động & tự lập
   * ===================================================== */
  {
    lessonId: "earning-2",
    title: "Tự làm, tự kiếm",
    estDurationSec: 25,
    scenes: [
      {
        text: "Pé Ti muốn có tiền mua cuốn sách. Mẹ nói: 'Con hãy GIÚP VIỆC nhà, mẹ thưởng!'",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "📖", size: 80 },
            { type: "emoji", emoji: "💭", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "Pé Ti dọn phòng, rửa bát, gấp quần áo. Mẹ vui lắm! Mẹ thưởng 30 nghìn. Vui quá!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🧹", size: 60 },
            { type: "emoji", emoji: "🍽️", size: 60 },
            { type: "emoji", emoji: "👕", size: 60 },
            { type: "bill", value: 30, tone: "good" },
          ],
        },
        mood: "happy",
      },
      {
        text: "Bài học: tiền từ LAO ĐỘNG là tiền sạch, đáng tự hào. Bé có thể tự kiếm tiền từ việc nhà phù hợp với tuổi!",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "🌟", size: 100 },
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * EARNING-3: Chia sẻ & giúp đỡ
   * ===================================================== */
  {
    lessonId: "earning-3",
    title: "Giúp bạn = Vui",
    estDurationSec: 25,
    scenes: [
      {
        text: "Pé Ti thấy bạn Lan buồn vì quên bút chì. Pé Ti mở cặp cho bạn mượn bút. Lan cười tươi!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "😢", size: 60 },
            { type: "emoji", emoji: "✏️", size: 60 },
            { type: "emoji", emoji: "😊", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "Pé Ti không mất tiền, nhưng nhận được gì? Nhận được NỤ CƯỜI của bạn, nhận được TÌNH BẠN!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "💝", size: 80 },
            { type: "emoji", emoji: "👫", size: 60 },
          ],
        },
        mood: "happy",
      },
      {
        text: "Có những thứ TIỀN KHÔNG MUA ĐƯỢC: sự yêu thương, tình bạn, niềm vui. Hãy là người biết CHIA SẺ và GIÚP ĐỠ nhé!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "❤️", size: 60 },
            { type: "emoji", emoji: "🌈", size: 60 },
            { type: "emoji", emoji: "🎁", size: 60 },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * SAFETY-1: Bảo vệ tài khoản
   * ===================================================== */
  {
    lessonId: "safety-1",
    title: "Giữ an toàn trên mạng",
    estDurationSec: 30,
    scenes: [
      {
        text: "Pé Ti có tài khoản ngân hàng. Có 3 điều BẮT BUỘC phải nhớ: KHÔNG chia sẻ mật khẩu, KHÔNG cho ai mã OTP, KHÔNG click link lạ!",
        visual: {
          kind: "props",
          items: [
            { type: "shield", tone: "safe" },
            { type: "emoji", emoji: "🔒", size: 60 },
            { type: "emoji", emoji: "❌", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "Nếu ai gọi điện xin mã OTP, đó là LỪA ĐẢO! Kể cả khi họ nói là nhân viên ngân hàng. Cúp máy và báo mẹ ngay!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "📞", size: 60 },
            { type: "shield", tone: "safe" },
            { type: "emoji", emoji: "🚫", size: 60 },
          ],
        },
        mood: "sad",
      },
      {
        text: "Bí quyết: MẬT KHẨU chỉ mình biết. Nếu lộ thì báo ngân hàng NGAY để khóa tài khoản. An toàn là trên hết!",
        visual: {
          kind: "spotlight",
          prop: { type: "shield", tone: "safe" },
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * SAFETY-2: Quỹ khẩn cấp
   * ===================================================== */
  {
    lessonId: "safety-2",
    title: "Quỹ dự phòng",
    estDurationSec: 25,
    scenes: [
      {
        text: "Cuối tuần, bạn Pé Ti bị ốm phải đi khám bác sĩ. Tốn 200 nghìn tiền khám. May có tiền dành!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🤒", size: 60 },
            { type: "emoji", emoji: "🏥", size: 60 },
            { type: "bill", value: 200, tone: "bad" },
          ],
        },
        mood: "sad",
      },
      {
        text: "Bố nói: 'Đó là QUỸ KHẨN CẤP! Mỗi tháng bố để dành 1 phần tiền để dùng khi CẦN GẤP mà không kịp kiếm.'",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "💼", size: 100 },
        },
        mood: "thinking",
      },
      {
        text: "Bí quyết: nên có QUỸ KHẨN CẤP bằng 3 tháng chi tiêu. Khi ốm đau, sửa xe, mất việc - đều có tiền xoay xở!",
        visual: {
          kind: "spotlight",
          prop: { type: "shield", tone: "safe" },
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * SAFETY-3: Tránh tín dụng đen
   * ===================================================== */
  {
    lessonId: "safety-3",
    title: "Tránh xa tín dụng đen",
    estDurationSec: 30,
    scenes: [
      {
        text: "Bạn Nam cần tiền gấp, thấy quảng cáo 'VAY NHANH trong 24h'. Nam vay 1 triệu.",
        visual: {
          kind: "props",
          items: [
            { type: "bill", value: 1000, tone: "good" },
            { type: "emoji", emoji: "⚡", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "1 tháng sau, người cho vay đòi 2 triệu! Gấp đôi! Gọi điện đòi liên tục. Nam sợ quá!",
        visual: {
          kind: "props",
          items: [
            { type: "bill", value: 2000, tone: "bad" },
            { type: "emoji", emoji: "😰", size: 60 },
            { type: "emoji", emoji: "📞", size: 60 },
          ],
        },
        mood: "sad",
      },
      {
        text: "Bài học: TÍN DỤNG ĐEN là lãi suất CẮT CỔ, có thể bị đe dọa. Nếu cần vay, hãy nhờ bố mẹ hoặc ngân hàng chính thống!",
        visual: {
          kind: "spotlight",
          prop: { type: "shield", tone: "safe" },
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * INVEST-1: Gửi tiết kiệm ngân hàng
   * ===================================================== */
  {
    lessonId: "invest-1",
    title: "Gửi tiết kiệm ở ngân hàng",
    estDurationSec: 30,
    scenes: [
      {
        text: "Bạn có 1 triệu đồng. Để trong nhà dễ mất, lại không sinh thêm tiền. Mang gửi NGÂN HÀNG nhé!",
        visual: {
          kind: "spotlight",
          prop: { type: "bank", label: "Ngân hàng" },
        },
        mood: "thinking",
      },
      {
        text: "Gửi 1 năm, lãi suất 6%/năm. Sau 1 năm bạn có 1 triệu 60 nghìn. Vừa AN TOÀN vừa CÓ LÃI!",
        visual: {
          kind: "props",
          items: [
            { type: "bill", value: 1000, tone: "good" },
            { type: "bill", value: 60, tone: "good" },
          ],
        },
        mood: "happy",
      },
      {
        text: "Ngân hàng an toàn vì có NHNN giám sát, có bảo hiểm tiền gửi. Đừng gửi ở chỗ lạ, hãy chọn ngân hàng uy tín!",
        visual: {
          kind: "props",
          items: [
            { type: "bank", label: "An toàn" },
            { type: "shield", tone: "safe" },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * INVEST-2: Lãi kép nâng cao
   * ===================================================== */
  {
    lessonId: "invest-2",
    title: "Sức mạnh lãi kép",
    estDurationSec: 30,
    scenes: [
      {
        text: "Bạn gửi 1 triệu, lãi 10%/năm. Năm 1: 1.1 triệu. Năm 2: 1.21 triệu. Năm 3: 1.33 triệu!",
        visual: {
          kind: "spotlight",
          prop: { type: "tree", size: 40 },
        },
        mood: "thinking",
      },
      {
        text: "Sau 10 năm, 1 triệu ban đầu thành 2.59 triệu! Gấp 2.5 lần mà BẠN KHÔNG PHẢI LÀM GÌ thêm!",
        visual: {
          kind: "spotlight",
          prop: { type: "tree", size: 80 },
        },
        mood: "happy",
      },
      {
        text: "Sau 20 năm: 6.73 triệu! Gấp 6.7 lần! Bí mật: BẮT ĐẦU SỚM. Càng trẻ gửi tiết kiệm, càng giàu khi lớn lên!",
        visual: {
          kind: "spotlight",
          prop: { type: "tree", size: 100 },
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * INVEST-3: Cổ phiếu & trái phiếu
   * ===================================================== */
  {
    lessonId: "invest-3",
    title: "Cổ phiếu & Trái phiếu",
    estDurationSec: 30,
    scenes: [
      {
        text: "CỔ PHIẾU là gì? Khi bạn mua cổ phiếu, bạn trở thành 1 CHỦ SỞ HỮU nhỏ của công ty!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🏢", size: 60 },
            { type: "emoji", emoji: "📈", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "Công ty làm ăn tốt, cổ phiếu TĂNG giá. Làm ăn kém, cổ phiếu GIẢM. Cổ phiếu có LỜI LỚN nhưng cũng có THUA LỖ!",
        visual: {
          kind: "split",
          left: [
            { type: "emoji", emoji: "📈", size: 80 },
            { type: "bill", value: 100, tone: "good" },
          ],
          right: [
            { type: "emoji", emoji: "📉", size: 80 },
            { type: "bill", value: 50, tone: "bad" },
          ],
          leftLabel: "Công ty TỐT",
          rightLabel: "Công ty XẤU",
        },
        mood: "thinking",
      },
      {
        text: "TRÁI PHIẾU an toàn hơn, lãi cố định. Cổ phiếu lời nhiều hơn nhưng rủi ro hơn. Bé cần học THẬT NHIỀU trước khi đầu tư!",
        visual: {
          kind: "props",
          items: [
            { type: "shield", tone: "safe" },
            { type: "emoji", emoji: "📚", size: 60 },
            { type: "emoji", emoji: "💡", size: 60 },
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
