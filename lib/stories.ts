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
        text: "[happy] Hôm nay Pé Ti được mẹ cho một chiếc heo đất màu hồng. Pé Ti thích lắm!",
        visual: {
          kind: "spotlight",
          prop: { type: "piggy", coins: 0, mood: "neutral" },
        },
        mood: "happy",
      },
      {
        text: "[curious] Mỗi ngày Pé Ti bỏ vào heo 5 nghìn đồng tiền tiêu vặt còn dư.",
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
        text: "[happy] Một tuần trôi qua. Pé Ti đếm: một, hai, ba... 35 nghìn rồi!",
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
        text: "[excited] Một tháng! Heo đất nặng trĩu. Pé Ti mở ra đếm: 150 nghìn đồng!",
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
        text: "[cheerful] Pé Ti học được: tiết kiệm không phải nhịn tiêu, mà là KIÊN TRÌ bỏ từng chút một. Phép màu nằm ở sự kiên trì!",
        visual: {
          kind: "spotlight",
          prop: { type: "piggy", coins: 30, mood: "rich" },
        },
        mood: "wave",
      },
      {
        text: "[excited] Bạn cũng thử nhé: mỗi ngày bỏ vào heo một chút, rồi xem phép màu xảy ra!",
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
        text: "[happy] Pé Ti vừa nhận 200 nghìn tiền lì xì Tết. Nhiều quá! Nhưng mẹ nói phải biết chia.",
        visual: {
          kind: "spotlight",
          prop: { type: "coin", amount: 200, tone: "gold" },
        },
        mood: "happy",
      },
      {
        text: "[curious] Mẹ đưa cho Pé Ti ba chiếc hũ. Mỗi hũ có một nhiệm vụ riêng.",
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
        text: "[happy] Hũ TIẾT KIỆM to nhất: bỏ vào 50 phần trăm, tức 100 nghìn. Đây là tiền để dành dài hạn.",
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
        text: "[happy] Hũ CHI TIÊU: 40 phần trăm, tức 80 nghìn. Để mua đồ cần thiết và đồ mình thích vừa phải.",
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
        text: "[excited] Hũ CHO ĐI: 10 phần trăm, tức 20 nghìn. Mua quà sinh nhật bà, giúp đỡ bạn có hoàn cảnh khó.",
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
        text: "[cheerful] Vậy là mỗi đồng tiền đều có việc làm tốt! Pé Ti vừa TIẾT KIỆM, vừa CHI TIÊU khôn ngoan, lại còn biết CHIA SẺ.",
        visual: {
          kind: "spotlight",
          prop: { type: "jar", label: "CÂN BẰNG", tone: "save", fillPct: 100 },
        },
        mood: "wave",
      },
      {
        text: "[excited] Bạn thử lấy 3 chiếc hũ thật ở nhà và chia tiền tiêu vặt vào nhé! Sẽ thấy mình GIÀU lên từng ngày đó!",
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
        text: "[curious] Đầu tuần, bạn Minh nhận 100 nghìn tiền tiêu vặt. Số tiền này phải dùng cho cả tuần!",
        visual: {
          kind: "spotlight",
          prop: { type: "bill", value: 100, tone: "good" },
        },
        mood: "thinking",
      },
      {
        text: "[happy] Minh ngồi xuống vẽ bản đồ tiền: ăn sáng 30 nghìn, đi học 20 nghìn, tiết kiệm 30 nghìn, giải trí 20 nghìn.",
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
        text: "[sighs] Thứ Tư, Minh thấy quán bánh tráng nướng ngon quá. Tiêu thêm 15 nghìn. Nhưng phần 'Giải trí' chỉ có 20 thôi!",
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
        text: "[sighs] Cuối tuần, Minh hết sạch 100 nghìn mà KHÔNG còn gì trong hũ tiết kiệm. Bài học: tiêu vượt hạn mất tiết kiệm!",
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
        text: "[excited] Tuần sau, Minh lập ngân sách TRƯỚC khi tiêu. Cuối tuần còn 30 nghìn bỏ vào heo đất! Thấy chưa, kế hoạch giúp bạn GIÀU hơn!",
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
        text: "[sighs] Pé Ti muốn mua bộ Lego 200 nghìn, nhưng trong heo đất chỉ có 50 nghìn. Pé Ti buồn lắm!",
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
        text: "[curious] Pé Ti nghĩ: hay là mình VAY tiền để mua đi? Nhưng vay ai, vay thế nào cho AN TOÀN? [curious]",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "🤔", size: 100 },
        },
        mood: "thinking",
      },
      {
        text: "[happy] Cách 1: Vay mẹ. Mẹ đồng ý cho Pé Ti mượn 150 nghìn, trả góp 25 nghìn mỗi tuần, không tính lãi.",
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
        text: "[sighs] Cách 2: Vay 'tín dụng đen' ngoài phố. Họ cho mượn NHANH, nhưng lãi suất RẤT CAO. Mỗi tuần phải trả gấp rưỡi!",
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
        text: "[curious] Sau 1 tháng: Pé Ti vay mẹ trả xong, còn dư 30 nghìn mua cuốn sách hay. Còn bạn Nam vay 'tín dụng đen' đang nợ gấp đôi!",
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
        text: "[excited] Bài học của Pé Ti: chỉ vay khi CẦN THIẾT, có KẾ HOẠCH trả, và chỉ vay người ĐÁNG TIN. Đừng bao giờ vay 'tín dụng đen'!",
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
   * MONEY-1: Tiền là gì? (khái niệm + lịch sử vỏ sò)
   * ===================================================== */
  {
    lessonId: "money-1",
    title: "Tiền là gì?",
    estDurationSec: 45,
    scenes: [
      {
        text: "[curious] Bạn thử tưởng tượng nhé: nhà bạn có 10 quả táo, nhà bạn Lan có 1 con gấu bông. Bạn muốn đổi gấu bông lấy táo. Nhưng bạn Lan lại muốn có kẹo, không thích táo. Rắc rối chưa nào!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🍎", size: 60 },
            { type: "emoji", emoji: "🧸", size: 60 },
            { type: "emoji", emoji: "🍬", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "[curious] Ngày xưa, người Việt chưa có tiền. Họ đổi đồ lấy đồ: 1 con gà đổi 2 cái rổ, 1 cái áo đổi 5 nải chuối. Nhưng nếu người ta không cần thứ mình có thì sao? Rất khó trao đổi!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🐔", size: 60 },
            { type: "emoji", emoji: "🧺", size: 60 },
            { type: "emoji", emoji: "👕", size: 60 },
            { type: "emoji", emoji: "🍌", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "[happy] Thế là mọi người CHỌN ra một thứ đặc biệt để làm tiền chung. Vỏ sò, muối, trâu, vải... ai cũng muốn có vì nó quý và hiếm!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🐚", size: 60 },
            { type: "emoji", emoji: "🧂", size: 60 },
            { type: "emoji", emoji: "🐃", size: 60 },
            { type: "emoji", emoji: "🧵", size: 60 },
          ],
        },
        mood: "happy",
      },
      {
        text: "[excited] Vậy tiền là gì? Tiền là thứ mọi người CÙNG ĐỒNG Ý có giá trị. Có tiền, mình mua được bất cứ thứ gì người khác bán - không cần đổi đồ nữa!",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "💡", size: 100 },
        },
        mood: "celebrate",
      },
      {
        text: "[happy] Ngày nay tiền có tiền xu, tiền giấy, và cả tiền trong điện thoại. Dù hình dạng nào, chúng đều làm CÙNG MỘT VIỆC: giúp mọi người trao đổi dễ dàng!",
        visual: {
          kind: "props",
          items: [
            { type: "coin", amount: 1, tone: "gold" },
            { type: "image", src: "/banknotes/100k.jpg", alt: "100.000đ", label: "100.000đ", size: 130 },
            { type: "emoji", emoji: "📱", size: 60 },
          ],
        },
        mood: "happy",
      },
    ],
  },

  /* =====================================================
   * MONEY-2: Tiền Việt Nam (mệnh giá + cách đếm)
   * ===================================================== */
  {
    lessonId: "money-2",
    title: "Tiền Việt Nam",
    estDurationSec: 45,
    scenes: [
      {
        text: "[happy] Tiền Việt Nam có hai loại: tiền xu (bằng kim loại) và tiền giấy (gọi là tờ tiền). Cả hai đều có giá trị như nhau, chỉ khác hình dạng thôi!",
        visual: {
          kind: "props",
          items: [
            { type: "coin", amount: 1, tone: "gold" },
            { type: "image", src: "/banknotes/10k.png", alt: "Tờ 10 nghìn", label: "10.000đ" },
          ],
        },
        mood: "happy",
      },
      {
        text: "[curious] Tiền Việt Nam có nhiều mệnh giá: 1 nghìn, 2 nghìn, 5 nghìn, 10 nghìn, 20 nghìn, 50 nghìn, 100 nghìn, 200 nghìn, 500 nghìn đồng. Tờ càng to thì giá trị càng lớn!",
        visual: {
          kind: "props",
          items: [
            { type: "image", src: "/banknotes/10k.png", alt: "10.000đ", label: "10.000đ", size: 110 },
            { type: "image", src: "/banknotes/20k.jpg", alt: "20.000đ", label: "20.000đ", size: 110 },
            { type: "image", src: "/banknotes/50k.png", alt: "50.000đ", label: "50.000đ", size: 110 },
            { type: "image", src: "/banknotes/100k.jpg", alt: "100.000đ", label: "100.000đ", size: 110 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "[happy] Mẹo nhớ: 1 tờ 100 nghìn bằng 10 tờ 10 nghìn! Tờ to tiện hơn, nhưng tổng giá trị không đổi.",
        visual: {
          kind: "props",
          items: [
            { type: "image", src: "/banknotes/100k.jpg", alt: "100.000đ", label: "100.000đ", size: 160 },
            { type: "image", src: "/banknotes/10k.png", alt: "10.000đ", label: "10.000đ", size: 90 },
            { type: "image", src: "/banknotes/10k.png", alt: "10.000đ", label: "10.000đ", size: 90 },
            { type: "image", src: "/banknotes/10k.png", alt: "10.000đ", label: "10.000đ", size: 90 },
          ],
        },
        mood: "happy",
      },
      {
        text: "[excited] Bạn mua cây kem 15 nghìn, đưa tờ 20 nghìn - người bán trả lại 5 nghìn. Đếm tiền thừa là kỹ năng quan trọng, giúp bạn không bị thiếu hoặc mất tiền oan!",
        visual: {
          kind: "props",
          items: [
            { type: "image", src: "/banknotes/20k.jpg", alt: "20.000đ", label: "20.000đ", size: 130 },
            { type: "emoji", emoji: "🍦", size: 50 },
            { type: "coin", amount: 5, tone: "gold" },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * MONEY-3: Tiền mua được gì? (chức năng + giới hạn)
   * ===================================================== */
  {
    lessonId: "money-3",
    title: "Tiền mua được gì?",
    estDurationSec: 40,
    scenes: [
      {
        text: "[curious] Tiền mua được những thứ mình CẦN để sống: cơm để không đói, sách vở để đi học, áo quần để mặc, thuốc khi ốm. Không có tiền thì cuộc sống khó khăn lắm!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🍚", size: 60 },
            { type: "emoji", emoji: "📚", size: 60 },
            { type: "emoji", emoji: "👕", size: 60 },
            { type: "emoji", emoji: "💊", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "[happy] Tiền cũng mua được những thứ mình THÍCH: kem, đồ chơi, truyện tranh, vé xem phim. Những thứ này làm mình vui hơn!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🍦", size: 60 },
            { type: "emoji", emoji: "🧸", size: 60 },
            { type: "emoji", emoji: "📖", size: 60 },
            { type: "emoji", emoji: "🎬", size: 60 },
          ],
        },
        mood: "happy",
      },
      {
        text: "[excited] NHƯNG có những thứ tiền KHÔNG MUA ĐƯỢC: tình yêu thương của bố mẹ, tình bạn, sức khỏe, niềm vui thật sự. Bạn không thể trả tiền để có những thứ này!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "❤️", size: 60 },
            { type: "emoji", emoji: "👫", size: 60 },
            { type: "emoji", emoji: "💪", size: 60 },
            { type: "emoji", emoji: "😊", size: 60 },
          ],
        },
        mood: "celebrate",
      },
      {
        text: "[cheerful] Vậy nên: tiền rất quan trọng để sống tốt, nhưng tình yêu thương, sức khỏe và gia đình quan trọng HƠN. Hãy trân trọng cả tiền bạc lẫn những thứ tiền không mua được nhé!",
        visual: {
          kind: "props",
          items: [
            { type: "coin", amount: 1, tone: "gold" },
            { type: "emoji", emoji: "❤️", size: 70 },
            { type: "sparkle" },
          ],
        },
        mood: "wave",
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
        text: "[curious] Nhu cầu là thứ mình CẦN để sống: cơm để không đói, nước để không khát, nhà để không lạnh.",
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
        text: "[happy] Còn có: áo quần để mặc, sách vở để học, thuốc khi ốm. Đây là 5 nhu cầu cơ bản của con người!",
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
        text: "[excited] Bạn nhớ nhé: NHU CẦU = thứ mình cần. Nếu thiếu thì khó sống hoặc sống không tốt. Còn thứ mình MUỐN thì không cần thiết phải có ngay!",
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
        text: "[curious] CƠM là NHU CẦU - không ăn thì đói, không thể thiếu!",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "🍚", size: 100 },
        },
        mood: "thinking",
      },
      {
        text: "[curious] KEM là MONG MUỐN - thích thì ăn, không ăn vẫn sống được! Cả hai đều tốt, nhưng khác nhau.",
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
        text: "[whispers] Bí quyết: trước khi mua, hỏi 'Mình CẦN cái này không?' Nếu không cần, hãy chờ vài ngày. Nếu vẫn thích thì mua!",
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
        text: "[curious] Bạn có 100 nghìn. Bạn muốn mua: kem 20k, bút chì màu 30k, truyện tranh 50k.",
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
        text: "[curious] Bút chì màu phục vụ HỌC TẬP - cần cho việc học. Truyện tranh thì vui nhưng không cần. Kem là mong muốn.",
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
        text: "[excited] Chọn thông minh: mua bút chì màu 30k (cần cho học), còn 70k tiết kiệm dần! Thế là VỪA ĐỦ mà KHÔNG LÃNG PHÍ.",
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
        text: "[curious] Pé Ti muốn mua xe đạp 2 triệu. Nhưng tiết kiệm kiểu gì cho đủ? Mẹ nói: lập mục tiêu SMART!",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "🚲", size: 100 },
        },
        mood: "thinking",
      },
      {
        text: "[curious] S - Cụ thể: 'Mua xe đạp 2 triệu'. M - Đo được: biết chínhá xác bao nhiêu tiền. A - Khả thi: tiết kiệm được.",
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
        text: "[excited] R - Thực tế: mỗi tháng tiết kiệm được 200k. T - Thời hạn: trong 10 tháng. SMART = mục tiêu RÕ RÀNG!",
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
        text: "[curious] Pé Ti gửi heo 100 nghìn. Sau 1 năm mẹ thưởng thêm 10% là 10 nghìn. Tổng: 110 nghìn!",
        visual: {
          kind: "spotlight",
          prop: { type: "piggy", coins: 10, mood: "happy" },
        },
        mood: "thinking",
      },
      {
        text: "[happy] Năm sau, 10% của 110 nghìn = 11 nghìn. Tổng 121 nghìn! Tiền CŨ cũng sinh ra tiền MỚI. Đó gọi là LÃI KÉP!",
        visual: {
          kind: "spotlight",
          prop: { type: "tree", size: 50 },
        },
        mood: "happy",
      },
      {
        text: "[excited] Càng để lâu, tiền càng nhiều! 100 nghìn sau 5 năm có thể thành 161 nghìn. Thần kỳ chưa nào? [excited] [excited] [excited]",
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
        text: "[curious] Bạn thắc mắc: 'Bố mẹ lấy tiền ở đâu?' Câu trả lời là: BỐ MẸ ĐI LÀM và nhận LƯƠNG.",
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
        text: "[happy] Mỗi tháng bố mẹ làm việc, công ty trả lương. Tiền lương dùng để mua thức ăn, nhà cửa, quần áo, sách vở cho cả nhà!",
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
        text: "[excited] Tiền không tự sinh ra. Bố mẹ phải LÀM VIỆC mới có tiền. Vậy nên mình phải biết TRÂN TRỌNG từng đồng nhé!",
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
        text: "[curious] Pé Ti muốn có tiền mua cuốn sách. Mẹ nói: 'Con hãy GIÚP VIỆC nhà, mẹ thưởng!'",
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
        text: "[happy] Pé Ti dọn phòng, rửa bát, gấp quần áo. Mẹ vui lắm! Mẹ thưởng 30 nghìn. Vui quá!",
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
        text: "[excited] Bài học: tiền từ LAO ĐỘNG là tiền sạch, đáng tự hào. Bé có thể tự kiếm tiền từ việc nhà phù hợp với tuổi!",
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
        text: "[curious] Pé Ti thấy bạn Lan buồn vì quên bút chì. Pé Ti mở cặp cho bạn mượn bút. Lan cười tươi!",
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
        text: "[happy] Pé Ti không mất tiền, nhưng nhận được gì? Nhận được NỤ CƯỜI của bạn, nhận được TÌNH BẠN!",
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
        text: "[excited] Có những thứ TIỀN KHÔNG MUA ĐƯỢC: sự yêu thương, tình bạn, niềm vui. Hãy là người biết CHIA SẺ và GIÚP ĐỠ nhé!",
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
        text: "[curious] Pé Ti có tài khoản ngân hàng. Có 3 điều BẮT BUỘC phải nhớ: KHÔNG chia sẻ mật khẩu, KHÔNG cho ai mã OTP, KHÔNG click link lạ!",
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
        text: "[sighs] Nếu ai gọi điện xin mã OTP, đó là LỪA ĐẢO! Kể cả khi họ nói là nhân viên ngân hàng. Cúp máy và báo mẹ ngay!",
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
        text: "[whispers] Bí quyết: MẬT KHẨU chỉ mình biết. Nếu lộ thì báo ngân hàng NGAY để khóa tài khoản. An toàn là trên hết!",
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
        text: "[sighs] Cuối tuần, bạn Pé Ti bị ốm phải đi khám bác sĩ. Tốn 200 nghìn tiền khám. May có tiền dành!",
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
        text: "[curious] Bố nói: 'Đó là QUỸ KHẨN CẤP! Mỗi tháng bố để dành 1 phần tiền để dùng khi CẦN GẤP mà không kịp kiếm.'",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "💼", size: 100 },
        },
        mood: "thinking",
      },
      {
        text: "[whispers] Bí quyết: nên có QUỸ KHẨN CẤP bằng 3 tháng chi tiêu. Khi ốm đau, sửa xe, mất việc - đều có tiền xoay xở!",
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
        text: "[curious] Bạn Nam cần tiền gấp, thấy quảng cáo '[whispers] VAY NHANH trong 24h'. Nam vay 1 triệu.",
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
        text: "[sighs] 1 tháng sau, người cho vay đòi 2 triệu! Gấp đôi! Gọi điện đòi liên tục. Nam sợ quá!",
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
        text: "[excited] Bài học: TÍN DỤNG ĐEN là lãi suất CẮT CỔ, có thể bị đe dọa. Nếu cần vay, hãy nhờ bố mẹ hoặc ngân hàng chính thống!",
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
        text: "[curious] Bạn có 1 triệu đồng. Để trong nhà dễ mất, lại không sinh thêm tiền. Mang gửi NGÂN HÀNG nhé!",
        visual: {
          kind: "spotlight",
          prop: { type: "bank", label: "Ngân hàng" },
        },
        mood: "thinking",
      },
      {
        text: "[happy] Gửi 1 năm, lãi suất 6%/năm. Sau 1 năm bạn có 1 triệu 60 nghìn. Vừa AN TOÀN vừa CÓ LÃI!",
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
        text: "[excited] Ngân hàng an toàn vì có NHNN giám sát, có bảo hiểm tiền gửi. Đừng gửi ở chỗ lạ, hãy chọn ngân hàng uy tín!",
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
        text: "[curious] Bạn gửi 1 triệu, lãi 10%/năm. Năm 1: 1.1 triệu. Năm 2: 1.21 triệu. Năm 3: 1.33 triệu!",
        visual: {
          kind: "spotlight",
          prop: { type: "tree", size: 40 },
        },
        mood: "thinking",
      },
      {
        text: "[happy] Sau 10 năm, 1 triệu ban đầu thành 2.59 triệu! Gấp 2.5 lần mà BẠN KHÔNG PHẢI LÀM GÌ thêm!",
        visual: {
          kind: "spotlight",
          prop: { type: "tree", size: 80 },
        },
        mood: "happy",
      },
      {
        text: "[excited] Sau 20 năm: 6.73 triệu! Gấp 6.7 lần! [whispers] Bí mật: BẮT ĐẦU SỚM. Càng trẻ gửi tiết kiệm, càng giàu khi lớn lên!",
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
        text: "[curious] CỔ PHIẾU là gì? Khi bạn mua cổ phiếu, bạn trở thành 1 CHỦ SỞ HỮU nhỏ của công ty!",
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
        text: "[curious] Công ty làm ăn tốt, cổ phiếu TĂNG giá. Làm ăn kém, cổ phiếu GIẢM. Cổ phiếu có LỜI LỚN nhưng cũng có THUA LỖ!",
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
        text: "[excited] TRÁI PHIẾU an toàn hơn, lãi cố định. Cổ phiếu lời nhiều hơn nhưng rủi ro hơn. Bé cần học THẬT NHIỀU trước khi đầu tư!",
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

  /* =====================================================
   * EPAY-1: Thanh toán điện tử là gì
   * ===================================================== */
  {
    lessonId: "epay-1",
    title: "Ví điện tử thần kỳ",
    estDurationSec: 25,
    scenes: [
      {
        text: "[happy] Bạn thấy mẹ mở điện thoại, quét mã, rồi... trả tiền xong! Không cần tiền mặt! Đó là VÍ ĐIỆN TỬ!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "📱", size: 80 },
            { type: "emoji", emoji: "✨", size: 50 },
          ],
        },
        mood: "happy",
      },
      {
        text: "[happy] MoMo, ZaloPay, ShopeePay là các VÍ ĐIỆN TỬ phổ biến ở Việt Nam. Bạn nạp tiền vào ví rồi dùng để mua đồ, chuyển tiền cho bạn bè!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "💜", size: 50 },
            { type: "emoji", emoji: "💙", size: 50 },
            { type: "emoji", emoji: "🧡", size: 50 },
            { type: "bill", value: 100, tone: "good" },
          ],
        },
        mood: "happy",
      },
      {
        text: "[whispers] Bí quyết: ví điện tử tiện lắm, NHƯNG phải GIỮ BÍ MẬT mật khẩu. Đừng cho ai biết nhé!",
        visual: {
          kind: "props",
          items: [
            { type: "shield", tone: "safe" },
            { type: "emoji", emoji: "🔒", size: 60 },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * EPAY-2: Dùng ví điện tử an toàn
   * ===================================================== */
  {
    lessonId: "epay-2",
    title: "Bảo mật ví thông minh",
    estDurationSec: 30,
    scenes: [
      {
        text: "[curious] Pé Ti thấy tin nhắn '[whispers] TRÚNG THƯỞNG 10 TRIỆU! Click ngay!' Pé Ti háo hức click. ĐÚNG HAY SAI? [curious]",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "💬", size: 60 },
            { type: "emoji", emoji: "🎁", size: 60 },
            { type: "emoji", emoji: "❓", size: 60 },
          ],
        },
        mood: "thinking",
      },
      {
        text: "[sighs] SAI RỒI! Đó là LỪA ĐẢO! Không có ai tặng 10 triệu qua tin nhắn. Click vào là MẤT TIỀN ngay!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🚫", size: 80 },
            { type: "bill", value: 0, tone: "bad" },
          ],
        },
        mood: "sad",
      },
      {
        text: "[whispers] Bí quyết vàng: GIỮ BÍ MẬT mật khẩu + mã OTP, bật vân tay, và click link lạ là [whispers] KHÔNG BAO GIỜ!",
        visual: {
          kind: "props",
          items: [
            { type: "shield", tone: "safe" },
            { type: "emoji", emoji: "👆", size: 60 },
            { type: "emoji", emoji: "✅", size: 60 },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * EPAY-3: QR code
   * ===================================================== */
  {
    lessonId: "epay-3",
    title: "QR code thần kỳ",
    estDurationSec: 25,
    scenes: [
      {
        text: "[curious] Trước cửa hàng có 1 ô vuông to to chứa nhiều ô nhỏ đen trắng. Đó là QR CODE!",
        visual: {
          kind: "spotlight",
          prop: { type: "emoji", emoji: "▦", size: 100 },
        },
        mood: "thinking",
      },
      {
        text: "[happy] Mở app MoMo/ZaloPay → bấm QUÉT → đưa camera vào QR → app tự điền số tiền → bạn KIỂM TRA → bấm XÁC NHẬN → XONG!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "📱", size: 60 },
            { type: "emoji", emoji: "👉", size: 50 },
            { type: "emoji", emoji: "✓", size: 50 },
          ],
        },
        mood: "happy",
      },
      {
        text: "[whispers] LƯU Ý: LUÔN kiểm tra số tiền trước khi xác nhận! Vì QR có thể lừa - hiển thị 25k nhưng thực tế 250k. Cẩn thận nhé!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "👀", size: 60 },
            { type: "bill", value: 25000, tone: "good" },
            { type: "shield", tone: "safe" },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * INSURANCE-1: Bảo hiểm là gì
   * ===================================================== */
  {
    lessonId: "insurance-1",
    title: "Bảo hiểm là gì?",
    estDurationSec: 25,
    scenes: [
      {
        text: "[curious] Pé Ti hỏi: 'Mẹ ơi, tại sao mỗi tháng mình đóng tiền gì đó mà không dùng?' Mẹ nói: 'Đó là BẢO HIỂM!'",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🤔", size: 80 },
            { type: "bill", value: 100, tone: "good" },
          ],
        },
        mood: "thinking",
      },
      {
        text: "[happy] Bảo hiểm giống như CÁI Ô. Trời nắng không dùng đến, nhưng khi TRỜI MƯA (ốm/tai nạn) thì có ngay!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "☀️", size: 60 },
            { type: "emoji", emoji: "🌂", size: 60 },
            { type: "emoji", emoji: "🌧️", size: 60 },
          ],
        },
        mood: "happy",
      },
      {
        text: "[excited] Bé có BHYT (bảo hiểm y tế) do Nhà nước cấp. Khi ốm phải nhập viện, BHYT chi trả một phần viện phí - gia đình bớt lo!",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🏥", size: 60 },
            { type: "shield", tone: "safe" },
            { type: "emoji", emoji: "💚", size: 60 },
          ],
        },
        mood: "celebrate",
      },
    ],
  },

  /* =====================================================
   * INSURANCE-2: Các loại bảo hiểm thường gặp
   * ===================================================== */
  {
    lessonId: "insurance-2",
    title: "Các loại bảo hiểm",
    estDurationSec: 30,
    scenes: [
      {
        text: "[happy] Có 3 loại bảo hiểm phổ biến: BHYT (sức khỏe), bảo hiểm xe (ô tô/xe máy), và bảo hiểm NHÂN THỌ (cả gia đình).",
        visual: {
          kind: "props",
          items: [
            { type: "emoji", emoji: "🏥", size: 50 },
            { type: "emoji", emoji: "🏍️", size: 50 },
            { type: "emoji", emoji: "👨‍👩‍👧", size: 50 },
          ],
        },
        mood: "happy",
      },
      {
        text: "[curious] Bảo hiểm NHÂN THỌ bảo vệ cả gia đình. Nếu bố/mẹ (người trụ cột) gặp rủi ro không đi làm được, công ty BH sẽ trả 1 khoản tiền lớn!",
        visual: {
          kind: "props",
          items: [
            { type: "shield", tone: "safe" },
            { type: "emoji", emoji: "👨‍👩‍👧", size: 60 },
            { type: "bill", value: 500, tone: "good" },
          ],
        },
        mood: "thinking",
      },
      {
        text: "[excited] Bài học: bảo hiểm KHÔNG phải lãng phí, mà là chuẩn bị trước cho lúc khó khăn. Một lần ốm nặng có thể tốn hàng trăm triệu - bảo hiểm giúp gia đình KHÔNG khánh kiệt!",
        visual: {
          kind: "props",
          items: [
            { type: "shield", tone: "safe" },
            { type: "emoji", emoji: "❤️", size: 60 },
            { type: "sparkle" },
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
