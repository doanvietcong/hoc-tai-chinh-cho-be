import type { Lesson, Topic, Badge, Question } from "./types";

/* ---------- Helper: build a quick MC question ---------- */
const mc = (
  id: string,
  prompt: string,
  correctOptionId: string,
  options: { id: string; label: string; emoji?: string }[],
  helperText?: string,
  explainer?: string,
): Question => ({
  id,
  type: "multiple-choice",
  prompt,
  helperText,
  explainer,
  options,
  correctOptionId,
});

const tf = (
  id: string,
  prompt: string,
  statement: string,
  correct: boolean,
  explainer?: string,
): Question => ({
  id,
  type: "true-false",
  prompt,
  statement,
  correct,
  explainer,
});

const drag = (
  id: string,
  prompt: string,
  buckets: { id: string; label: string; emoji?: string }[],
  items: { id: string; label: string; emoji?: string; bucketId: string }[],
  helperText?: string,
  explainer?: string,
): Question => ({
  id,
  type: "drag-sort",
  prompt,
  helperText,
  explainer,
  buckets,
  items,
});

const num = (
  id: string,
  prompt: string,
  correctNumber: number,
  unit?: string,
  hint?: string,
  explainer?: string,
): Question => ({
  id,
  type: "input-number",
  prompt,
  correctNumber,
  unit,
  hint,
  explainer,
});

/* ============================================================
 * TOPIC 1 – Tiền là gì? (5-7 tuổi)
 * ============================================================ */
const moneyLessons: Lesson[] = [
  {
    id: "money-1",
    topicId: "money",
    index: 1,
    title: "Tiền đến từ đâu?",
    subtitle: "Khám phá nguồn gốc của tiền",
    ageGroup: ["5-7", "8-11"],
    xpReward: 30,
    coinReward: 15,
    questions: [
      mc(
        "m1-q1",
        "Tiền ở Việt Nam được in ra bởi ai?",
        "nhnn",
        [
          { id: "nhnn", label: "Ngân hàng Nhà nước Việt Nam", emoji: "🏛️" },
          { id: "shop", label: "Cửa hàng tạp hóa", emoji: "🏪" },
          { id: "school", label: "Trường học", emoji: "🏫" },
          { id: "tree", label: "Cây tiền trong rừng", emoji: "🌳" },
        ],
        "Tiền không mọc trên cây đâu nha!",
        "Ngân hàng Nhà nước Việt Nam là nơi in và phát hành tiền. Mỗi tờ tiền đều có hình rất đẹp mang hình ảnh lãnh tụ và phong cảnh.",
      ),
      tf(
        "m1-q2",
        "Đúng hay sai?",
        "Ngày xưa, người Việt chưa có tiền, họ dùng vỏ sò, muối để đổi hàng.",
        true,
        "Đúng rồi! Hồi xưa người ta đem muối, vỏ sò, lụa... để đổi lấy thứ mình cần. Sau này mới có tiền cho dễ dùng.",
      ),
      mc(
        "m1-q3",
        "Đơn vị tiền của Việt Nam là gì?",
        "vnd",
        [
          { id: "vnd", label: "Đồng (VND)", emoji: "🇻🇳" },
          { id: "usd", label: "Đô la Mỹ (USD)", emoji: "💵" },
          { id: "yen", label: "Yên Nhật", emoji: "🇯🇵" },
          { id: "btc", label: "Bitcoin", emoji: "🪙" },
        ],
        undefined,
        "Đồng là tiền của Việt Nam. Một đồng còn được viết tắt là VND.",
      ),
      mc(
        "m1-q4",
        "Một quyển truyện tranh giá 25.000đ. Bạn nên trả bằng những tờ nào?",
        "2x10+1x5",
        [
          { id: "1x20+1x5", label: "1 tờ 20.000đ + 1 tờ 5.000đ", emoji: "💴" },
          { id: "2x10+1x5", label: "2 tờ 10.000đ + 1 tờ 5.000đ", emoji: "💴" },
          { id: "1x50", label: "1 tờ 50.000đ", emoji: "💴" },
        ],
        "Mẹo: 25 = 20 + 5, hoặc 10 + 10 + 5",
        "Tuyệt vời! 10 + 10 + 5 = 25. Bạn giỏi tính toán ghê!",
      ),
    ],
  },
  {
    id: "money-2",
    topicId: "money",
    index: 2,
    title: "Làm quen với tờ tiền",
    subtitle: "Nhận biết mệnh giá phổ biến",
    ageGroup: ["5-7", "8-11"],
    xpReward: 30,
    coinReward: 15,
    questions: [
      drag(
        "m2-q1",
        "Kéo mỗi tờ tiền vào ô mệnh giá đúng:",
        [
          { id: "k1k", label: "1.000đ", emoji: "💴" },
          { id: "k2k", label: "2.000đ", emoji: "💴" },
          { id: "k5k", label: "5.000đ", emoji: "💴" },
          { id: "k10k", label: "10.000đ", emoji: "💴" },
          { id: "k20k", label: "20.000đ", emoji: "💴" },
        ],
        [
          { id: "n1", label: "1.000đ", emoji: "🟦", bucketId: "k1k" },
          { id: "n2", label: "2.000đ", emoji: "🟫", bucketId: "k2k" },
          { id: "n5", label: "5.000đ", emoji: "🟨", bucketId: "k5k" },
          { id: "n10", label: "10.000đ", emoji: "🟧", bucketId: "k10k" },
          { id: "n20", label: "20.000đ", emoji: "🟥", bucketId: "k20k" },
        ],
        "Kéo tờ tiền vào đúng ô mệnh giá nhé!",
        "Bạn nhận biết tiền rất tốt! Ghi nhớ mệnh giá giúp bạn tính toán nhanh hơn.",
      ),
      mc(
        "m2-q2",
        "Bạn có 1 tờ 20.000đ và muốn mua cây viết 7.000đ. Bạn còn lại bao nhiêu?",
        "13k",
        [
          { id: "13k", label: "13.000đ", emoji: "🟢" },
          { id: "7k", label: "7.000đ", emoji: "🔴" },
          { id: "20k", label: "20.000đ", emoji: "⚪" },
        ],
        undefined,
        "20 - 7 = 13 nghìn đồng. Tính nhẩm nhanh lắm!",
      ),
      tf(
        "m2-q3",
        "Đúng hay sai?",
        "Tờ 500.000đ có màu đỏ hồng và là tờ có mệnh giá lớn nhất ở Việt Nam.",
        true,
        "Đúng rồi! Ở Việt Nam, tờ 500.000đ là tờ có mệnh giá lớn nhất đang lưu hành.",
      ),
    ],
  },
  {
    id: "money-3",
    topicId: "money",
    index: 3,
    title: "Tiền dùng để làm gì?",
    subtitle: "Hiểu công dụng của tiền",
    ageGroup: ["5-7", "8-11"],
    xpReward: 25,
    coinReward: 12,
    questions: [
      mc(
        "m3-q1",
        "Việc nào dưới đây CẦN dùng tiền?",
        "grocery",
        [
          { id: "grocery", label: "Mẹ đi chợ mua rau, thịt, gạo", emoji: "🥬" },
          { id: "sleep", label: "Con ngủ trưa", emoji: "😴" },
          { id: "play", label: "Con chơi với bạn", emoji: "⚽" },
          { id: "hug", label: "Mẹ ôm con", emoji: "🤗" },
        ],
        "Có những thứ tiền không mua được, đó là những điều tuyệt vời nhất!",
        "Mua thức ăn cho gia đình là nhu cầu thiết yếu. Có những thứ như tình yêu, giấc ngủ, niềm vui... tiền không mua được đâu!",
      ),
      mc(
        "m3-q2",
        "Bạn rủ bạn đi ăn kem. Kem giá 15.000đ, bạn có 10.000đ. Bạn nên làm gì?",
        "ask-parent",
        [
          { id: "borrow", label: "Mượn bạn 5.000đ", emoji: "😬" },
          { id: "ask-parent", label: "Xin thêm mẹ 5.000đ hoặc đợi mai", emoji: "💬" },
          { id: "steal", label: "Lấy cắp viên kem", emoji: "🚫" },
        ],
        undefined,
        "Khi không đủ tiền, tốt nhất là nói với mẹ/bố hoặc đợi lần sau. Trộm cắp là sai nhé!",
      ),
      tf(
        "m3-q3",
        "Đúng hay sai?",
        "Tiền chỉ dùng để mua đồ chơi cho vui.",
        false,
        "Sai rồi! Tiền dùng cho nhiều việc: ăn uống, học hành, khám bệnh, giúp đỡ người khác, tiết kiệm... Mua đồ chơi chỉ là một phần nhỏ thôi.",
      ),
    ],
  },
];

/* ============================================================
 * TOPIC 2 – Nhu cầu & Mong muốn (8-11 tuổi)
 * ============================================================ */
const needsWantsLessons: Lesson[] = [
  {
    id: "needs-1",
    topicId: "needs-wants",
    index: 1,
    title: "Nhu cầu vs. Mong muốn",
    subtitle: "Phân biệt thứ cần và thứ thích",
    ageGroup: ["8-11", "12-15"],
    xpReward: 35,
    coinReward: 18,
    questions: [
      mc(
        "nw1-q1",
        "Nhu cầu là gì?",
        "need-def",
        [
          {
            id: "need-def",
            label: "Thứ bạn CẦN để sống và khỏe mạnh",
            emoji: "💚",
          },
          { id: "want-def", label: "Thứ bạn THÍCH nhưng không cần", emoji: "💛" },
          { id: "dream", label: "Thứ bạn mơ ước viễn vông", emoji: "💭" },
          { id: "gift", label: "Thứ bạn được tặng", emoji: "🎁" },
        ],
        undefined,
        "Nhu cầu = cần thiết (ăn, uống, nhà ở, học hành). Mong muốn = thích nhưng sống thiếu vẫn được.",
      ),
      drag(
        "nw1-q2",
        "Phân loại vào 2 nhóm:",
        [
          { id: "need", label: "Nhu cầu", emoji: "✅" },
          { id: "want", label: "Mong muốn", emoji: "💫" },
        ],
        [
          { id: "i-rice", label: "Gạo ăn hàng ngày", emoji: "🍚", bucketId: "need" },
          { id: "i-book", label: "Sách vở đi học", emoji: "📚", bucketId: "need" },
          { id: "i-toy", label: "Đồ chơi robot", emoji: "🤖", bucketId: "want" },
          { id: "i-ice", label: "Kem", emoji: "🍦", bucketId: "want" },
          { id: "i-medic", label: "Thuốc khi bệnh", emoji: "💊", bucketId: "need" },
          { id: "i-game", label: "Game mới", emoji: "🎮", bucketId: "want" },
        ],
        "Kéo từng thẻ vào nhóm đúng nhé!",
        "Tuyệt vời! Khi hiểu rõ nhu cầu - mong muốn, bạn sẽ biết cách dùng tiền hợp lý hơn.",
      ),
      mc(
        "nw1-q3",
        "Bạn đi học về, trời nóng 38°C, bạn thèm 1 ly trà sữa 30.000đ. Đây là nhu cầu hay mong muốn?",
        "want",
        [
          { id: "need", label: "Nhu cầu", emoji: "✅" },
          { id: "want", label: "Mong muốn", emoji: "💫" },
        ],
        "Mẹo: nếu thiếu nó bạn vẫn sống khỏe thì là mong muốn.",
        "Đúng rồi! Nước lọc cũng giúp bạn giải khát mà không tốn tiền. Trà sữa là thứ ngon nhưng không cần thiết.",
      ),
    ],
  },
  {
    id: "needs-2",
    topicId: "needs-wants",
    index: 2,
    title: "Tình huống mua sắm",
    subtitle: "Luyện tập ra quyết định",
    ageGroup: ["8-11", "12-15"],
    xpReward: 35,
    coinReward: 18,
    questions: [
      mc(
        "nw2-q1",
        "Bạn có 50.000đ tiền tiêu vặt. Điều nào nên làm ĐẦU TIÊN?",
        "save-part",
        [
          {
            id: "buy-toy",
            label: "Mua ngay đồ chơi mình thích 40.000đ",
            emoji: "🛍️",
          },
          {
            id: "save-part",
            label: "Bỏ vào heo đất 20.000đ, 30.000đ còn lại tiêu dần",
            emoji: "🐷",
          },
          {
            id: "all-save",
            label: "Bỏ hết vào heo đất, không tiêu gì",
            emoji: "🪙",
          },
        ],
        "Bạn không cần bỏ hết - quan trọng là CÓ TIẾT KIỆM một phần.",
        "Hay lắm! 50/30/20 là công thức phổ biến: 50% nhu cầu, 30% mong muốn, 20% tiết kiệm. Bạn nhớ chưa?",
      ),
      mc(
        "nw2-q2",
        "Bạn đi siêu thị với mẹ. Mẹ bảo: 'Con chọn 1 thứ'. Bạn nên chọn thế nào?",
        "check-list",
        [
          {
            id: "shiny",
            label: "Cái gì nhìn bắt mắt nhất, lấy luôn",
            emoji: "✨",
          },
          {
            id: "check-list",
            label: "Hỏi mẹ cần gì trước, rồi chọn trong danh sách đó",
            emoji: "📝",
          },
          {
            id: "expensive",
            label: "Cái đắt nhất trong quầy",
            emoji: "💎",
          },
        ],
        undefined,
        "Giỏi quá! Mua sắm có kế hoạch giúp gia đình không lãng phí và bạn học được cách quản lý tiền.",
      ),
      tf(
        "nw2-q3",
        "Đúng hay sai?",
        "Bạn có 100.000đ tiết kiệm, muốn mua 1 đôi giày 80.000đ, còn lại 20.000đ. Đây là quyết định thông minh.",
        false,
        "Hmm, chưa hẳn. Nếu bạn chưa có đôi giày nào để đi thì đó là nhu cầu - OK. Nhưng nếu nhà bạn đã có 5 đôi giày rồi, thì đây là mong muốn - nên tiết kiệm tiếp!",
      ),
    ],
  },
  {
    id: "needs-3",
    topicId: "needs-wants",
    index: 3,
    title: "Lập danh sách ưu tiên",
    subtitle: "Sắp xếp việc quan trọng",
    ageGroup: ["8-11", "12-15"],
    xpReward: 30,
    coinReward: 15,
    questions: [
      drag(
        "nw3-q1",
        "Sắp xếp các bước mua sắm thông minh theo thứ tự đúng:",
        [
          { id: "step1", label: "Bước 1", emoji: "1️⃣" },
          { id: "step2", label: "Bước 2", emoji: "2️⃣" },
          { id: "step3", label: "Bước 3", emoji: "3️⃣" },
          { id: "step4", label: "Bước 4", emoji: "4️⃣" },
        ],
        [
          {
            id: "s-need",
            label: "Xác định NHU CẦU thật sự",
            emoji: "✅",
            bucketId: "step1",
          },
          {
            id: "s-budget",
            label: "Đặt NGÂN SÁCH tối đa",
            emoji: "💰",
            bucketId: "step2",
          },
          {
            id: "s-compare",
            label: "SO SÁNH giá ở vài nơi",
            emoji: "🔍",
            bucketId: "step3",
          },
          {
            id: "s-decide",
            label: "Đưa ra QUYẾT ĐỊNH cuối cùng",
            emoji: "🎯",
            bucketId: "step4",
          },
        ],
        "Một quy trình tốt giúp bạn không mua hối hận!",
        "Quy trình 4 bước: Nhu cầu → Ngân sách → So sánh → Quyết định. Áp dụng được cho cả mua sắm lớn nhỏ!",
      ),
      mc(
        "nw3-q2",
        "Khi lập danh sách mua sắm, điều quan trọng nhất là gì?",
        "priority",
        [
          { id: "priority", label: "Sắp xếp theo nhu cầu, không theo cảm xúc", emoji: "🧠" },
          { id: "first-think", label: "Mua đầu tiên thứ mình vừa nghĩ ra", emoji: "💭" },
          { id: "most-ads", label: "Mua thứ quảng cáo nhiều nhất", emoji: "📺" },
        ],
        undefined,
        "Sắp xếp ưu tiên giúp bạn mua đúng thứ cần, tránh lãng phí tiền cho những thứ không cần.",
      ),
      tf(
        "nw3-q3",
        "Đúng hay sai?",
        "Có danh sách mua sắm giúp bạn tiết kiệm tiền.",
        true,
        "Đúng! Các nghiên cứu cho thấy đi siêu thị có danh sách sẵn giúp tiết kiệm 20-30% so với đi 'lang thang'.",
      ),
    ],
  },
];

/* ============================================================
 * TOPIC 3 – Tiết kiệm thông minh (8-15 tuổi)
 * ============================================================ */
const savingLessons: Lesson[] = [
  {
    id: "saving-1",
    topicId: "saving",
    index: 1,
    title: "Mục tiêu tiết kiệm",
    subtitle: "Đặt mục tiêu rõ ràng",
    ageGroup: ["8-11", "12-15"],
    xpReward: 35,
    coinReward: 18,
    questions: [
      mc(
        "sv1-q1",
        "Mục tiêu tiết kiệm tốt cần điều gì?",
        "specific",
        [
          { id: "specific", label: "Rõ ràng, có số tiền & thời gian cụ thể", emoji: "🎯" },
          { id: "vague", label: "Mơ hồ kiểu 'mình muốn có nhiều tiền'", emoji: "🌫️" },
          { id: "borrow", label: "Chỉ cần mượn thêm là xong", emoji: "🤷" },
        ],
        "Mục tiêu tốt = cụ thể, đo lường được, có thời hạn.",
        "Đúng rồi! Mục tiêu SMART: Specific (cụ thể) - Measurable (đo được) - Achievable (khả thi) - Relevant (liên quan) - Time-bound (có hạn).",
      ),
      num(
        "sv1-q2",
        "Bạn muốn mua xe đạp 1.500.000đ. Mỗi tuần bạn tiết kiệm 150.000đ. Hỏi sau bao nhiêu tuần bạn đủ tiền?",
        10,
        "tuần",
        "Gợi ý: Lấy tổng tiền chia cho số tiền mỗi tuần.",
        "Chính xác! 1.500.000 ÷ 150.000 = 10 tuần. Tính nhanh quá!",
      ),
      tf(
        "sv1-q3",
        "Đúng hay sai?",
        "Mục tiêu tiết kiệm phải là mục tiêu lớn mới có ý nghĩa.",
        false,
        "Sai! Mục tiêu nhỏ cũng tuyệt vời: 'Tiết kiệm 50.000đ mỗi tuần để mua truyện tranh'. Quan trọng là bạn KIÊN TRÌ, không phải mục tiêu lớn hay nhỏ.",
      ),
    ],
  },
  {
    id: "saving-2",
    topicId: "saving",
    index: 2,
    title: "Heo đất ảo của bạn",
    subtitle: "Xây dựng thói quen tiết kiệm",
    ageGroup: ["8-11"],
    xpReward: 35,
    coinReward: 20,
    questions: [
      num(
        "sv2-q1",
        "Bạn cho heo đất 5.000đ mỗi ngày. Sau 1 tuần (7 ngày), bạn có bao nhiêu?",
        35000,
        "đồng",
        "Gợi ý: 5.000 × 7 = ?",
        "Tuyệt vời! 5.000 × 7 = 35.000đ. Mỗi ngày một chút, tuần được cả đống!",
      ),
      mc(
        "sv2-q2",
        "Bạn nên để bao nhiêu phần trăm tiền tiêu vặt vào tiết kiệm?",
        "30-50",
        [
          { id: "0", label: "0% - tiêu hết", emoji: "🛒" },
          { id: "10-20", label: "10-20%", emoji: "🐢" },
          { id: "30-50", label: "30-50%", emoji: "🐷" },
          { id: "100", label: "100% - không tiêu gì", emoji: "🧊" },
        ],
        "Cân bằng là quan trọng nhất!",
        "Tuyệt vời! 30-50% là con số vàng. Bạn vừa có tiền tiêu, vừa tiết kiệm được mục tiêu dài hạn.",
      ),
      tf(
        "sv2-q3",
        "Đúng hay sai?",
        "Tiết kiệm nghĩa là không bao giờ được tiêu xài gì.",
        false,
        "Sai! Tiết kiệm nghĩa là CHIA TIỀN khéo léo: 1 phần tiêu cho nhu cầu, 1 phần cho mong muốn, 1 phần để dành. Không phải nhịn hết!",
      ),
      mc(
        "sv2-q4",
        "Cách nào giúp bạn tiết kiệm tốt nhất?",
        "auto",
        [
          { id: "auto", label: "Bỏ tiền tiết kiệm NGAY khi nhận tiền tiêu vặt", emoji: "⏰" },
          { id: "leftover", label: "Tiêu xong phần còn lại mới tiết kiệm", emoji: "😅" },
          { id: "wish", label: "Cứ ước 'mai sẽ tiết kiệm'", emoji: "🌠" },
        ],
        "Mẹo: 'Trả cho mình trước, trả xong rồi hẵng tiêu!'",
        "Đỉnh lắm! Bí quyết của người giàu là trả cho tương lai của mình TRƯỚC, rồi mới tiêu phần còn lại.",
      ),
    ],
  },
  {
    id: "saving-3",
    topicId: "saving",
    index: 3,
    title: "Lãi kép & đầu tư cơ bản",
    subtitle: "Tiền đẻ ra tiền!",
    ageGroup: ["12-15"],
    xpReward: 40,
    coinReward: 22,
    questions: [
      num(
        "sv3-q1",
        "Bạn gửi tiết kiệm 1.000.000đ với lãi suất 10%/năm. Sau 1 năm bạn có bao nhiêu? (Làm tròn đến nghìn)",
        1100000,
        "đồng",
        "Gợi ý: 1.000.000 + (1.000.000 × 10%) = ?",
        "Chính xác! 1.000.000 + 100.000 = 1.100.000đ. Lãi = 100.000đ. Tiền của bạn sinh ra tiền!",
      ),
      tf(
        "sv3-q2",
        "Đúng hay sai?",
        "Lãi kép nghĩa là tiền lãi được cộng vào gốc, rồi tiếp tục sinh lãi.",
        true,
        "Chuẩn rồi! Lãi kép = lãi mẹ đẻ lãi con. Đây là cách giàu chậm mà chắc mà ai cũng có thể làm được.",
      ),
      num(
        "sv3-q3",
        "Bạn gửi 1.000.000đ, lãi 10%/năm, KHÔNG rút ra. Sau 2 năm bạn có bao nhiêu? (làm tròn nghìn)",
        1210000,
        "đồng",
        "Gợi ý: Năm 1 có 1.100.000đ. Năm 2: 1.100.000 × 1.1 = ?",
        "Đỉnh cao! 1.100.000 × 1.1 = 1.210.000đ. Bạn vừa thấy sức mạnh của lãi kép rồi đó!",
      ),
      mc(
        "sv3-q4",
        "Chiến lược tài chính nào KHÔNG nên làm khi còn đi học?",
        "allin",
        [
          { id: "allin", label: "Bỏ hết tiền vào một thứ may rủi để làm giàu nhanh", emoji: "🎰" },
          { id: "save", label: "Tiết kiệm đều đặn mỗi tháng", emoji: "🐖" },
          { id: "learn", label: "Học thêm kiến thức tài chính", emoji: "📚" },
          { id: "track", label: "Ghi chép thu chi hàng ngày", emoji: "📒" },
        ],
        "Cẩn thận với những lời hứa 'làm giàu nhanh' nhé!",
        "Đúng! 'Làm giàu nhanh' thường là lừa đảo. Bạn còn trẻ, hãy tập tiết kiệm & học kiến thức - đó là nền tảng vững nhất.",
      ),
    ],
  },
  {
    id: "saving-4",
    topicId: "saving",
    index: 4,
    title: "3 hũ tiền thần kỳ",
    subtitle: "Phân chia tiền cho TIẾT KIỆM - TIÊU - CHO ĐI",
    ageGroup: ["5-7", "8-11"],
    xpReward: 30,
    coinReward: 18,
    questions: [
      mc(
        "sv4-q1",
        "Phương pháp '3 hũ tiền' chia tiền của bạn thành mấy phần?",
        "three",
        [
          { id: "two", label: "2 phần: tiết kiệm và tiêu", emoji: "🥈" },
          { id: "three", label: "3 phần: tiết kiệm, tiêu, cho đi", emoji: "🥉" },
          { id: "four", label: "4 phần: tiết kiệm, tiêu, cho đi, dự phòng", emoji: "🏅" },
        ],
        "Đây là phương pháp nổi tiếng trên thế giới dạy trẻ quản lý tiền!",
        "Chính xác! 3 hũ tiền = TIẾT KIỆM (dành dụm) - TIÊU (mua đồ cần) - CHO ĐI (giúp người khác). Cân bằng cả 3!",
      ),
      drag(
        "sv4-q2",
        "Kéo các hoạt động vào đúng hũ tiền:",
        [
          { id: "save", label: "🏺 Hũ TIẾT KIỆM", emoji: "" },
          { id: "spend", label: "🛍️ Hũ TIÊU", emoji: "" },
          { id: "give", label: "🎁 Hũ CHO ĐI", emoji: "" },
        ],
        [
          { id: "i1", label: "Mua kem 5.000đ", emoji: "🍦", bucketId: "spend" },
          { id: "i2", label: "Gửi vào heo đất để mua xe đạp", emoji: "🚲", bucketId: "save" },
          { id: "i3", label: "Ủng hộ đồng bào bão lụt 50.000đ", emoji: "🌊", bucketId: "give" },
          { id: "i4", label: "Mua sách vở mới", emoji: "📚", bucketId: "spend" },
          { id: "i5", label: "Bỏ vào ống heo đất dành mua đồ chơi", emoji: "🐖", bucketId: "save" },
          { id: "i6", label: "Tặng bạn bút chì mới", emoji: "✏️", bucketId: "give" },
          { id: "i7", label: "Gửi tiết kiệm ngân hàng", emoji: "🏦", bucketId: "save" },
          { id: "i8", label: "Mua kẹo chia cho em nhỏ", emoji: "🍬", bucketId: "give" },
        ],
        "Phân loại đúng thì tiền sẽ được dùng hiệu quả nhất!",
        "Bạn phân loại rất chuẩn! Tiền chia 3 hũ: TIẾT KIỆM cho tương lai, TIÊU cho nhu cầu, CHO ĐI để giúp đỡ. Đây là cách dạy con của người Mỹ và Châu Âu.",
      ),
      mc(
        "sv4-q3",
        "Theo phương pháp 3 hũ, tỉ lệ gợi ý phổ biến là?",
        "rule",
        [
          { id: "all-save", label: "Tiết kiệm 100% - không tiêu gì", emoji: "🐖" },
          { id: "rule", label: "Tiết kiệm 50% - Tiêu 30% - Cho đi 20%", emoji: "⚖️" },
          { id: "all-spend", label: "Tiêu hết 100% cho vui", emoji: "🛍️" },
        ],
        "Mỗi gia đình có thể chọn tỉ lệ khác nhau, không có tỉ lệ nào đúng tuyệt đối!",
        "Tuyệt vời! Tỉ lệ 50-30-20 là phổ biến (50% tiết kiệm, 30% tiêu, 20% cho đi). Bạn có thể điều chỉnh theo gia đình mình!",
      ),
      num(
        "sv4-q4",
        "Bạn có 100.000đ. Chia theo tỉ lệ 50-30-20. Hũ TIẾT KIỆM được bao nhiêu?",
        50000,
        "đồng",
        "Gợi ý: 100.000 × 50% = ?",
        "Chính xác! 100.000 × 50% = 50.000đ vào hũ tiết kiệm. 30.000đ tiêu, 20.000đ cho đi!",
      ),
    ],
  },
];

/* ============================================================
 * TOPIC 4 – Kiếm tiền & Nghề nghiệp (8-15 tuổi)
 * ============================================================ */
const earningLessons: Lesson[] = [
  {
    id: "earning-1",
    topicId: "earning",
    index: 1,
    title: "Tiền đến từ đâu?",
    subtitle: "Khám phá cách người ta kiếm tiền",
    ageGroup: ["8-11", "12-15"],
    xpReward: 30,
    coinReward: 15,
    questions: [
      mc(
        "ea1-q1",
        "Tiền từ trên trời rơi xuống – bạn tin không?",
        "no",
        [
          { id: "no", label: "Không - tiền phải do người khác trả cho mình", emoji: "💪" },
          { id: "yes", label: "Có - chỉ cần chờ đúng ngày may mắn", emoji: "🍀" },
          { id: "tree", label: "Có - trồng cây tiền là có tiền", emoji: "🌳" },
        ],
        "Cây tiền chỉ có trong phim hoạt hình thôi nha!",
        "Đúng rồi! Tiền không tự sinh ra. Ai đó phải TRẢ tiền cho bạn - vì bạn làm điều gì đó có giá trị với họ.",
      ),
      mc(
        "ea1-q2",
        "Bạn muốn mua truyện tranh 30.000đ. Cách nào KIẾM TIỀN chính đáng?",
        "help-neighbor",
        [
          { id: "beg", label: "Xin bố mẹ thêm tiền mỗi ngày", emoji: "😢" },
          { id: "help-neighbor", label: "Giúp hàng xóm dọn nhà, nhận công 20.000đ", emoji: "🧹" },
          { id: "steal", label: "Lấy trộm tiền từ ví mẹ", emoji: "🚫" },
        ],
        undefined,
        "Tuyệt vời! Lao động trả công là cách kiếm tiền chính đáng. Bạn bỏ sức, bạn nhận tiền - rất rõ ràng!",
      ),
      tf(
        "ea1-q3",
        "Đúng hay sai?",
        "Bán đồ chơi cũ mình không dùng nữa là một cách kiếm tiền hợp lý.",
        true,
        "Đúng! Bán đồ cũ vừa có tiền vừa dọn phòng - lợi đôi đường.",
      ),
      drag(
        "ea1-q4",
        "Phân loại: đâu là việc KIẾM TIỀN, đâu là việc XIN TIỀN?",
        [
          { id: "earn", label: "Kiếm tiền (làm ra)", emoji: "💼" },
          { id: "beg", label: "Xin tiền (không làm)", emoji: "🙏" },
        ],
        [
          { id: "i1", label: "Rửa xe đạp cho bác hàng xóm", emoji: "🚲", bucketId: "earn" },
          { id: "i2", label: "Xin mẹ 50k để mua kẹo", emoji: "🍬", bucketId: "beg" },
          { id: "i3", label: "Bán nước chanh cho khách", emoji: "🍋", bucketId: "earn" },
          { id: "i4", label: "Đòi mẹ tiền sinh nhật bạn", emoji: "🎂", bucketId: "beg" },
          { id: "i5", label: "Dạy em học bài, nhận tiền thưởng", emoji: "📚", bucketId: "earn" },
          { id: "i6", label: "Đứng ngoài cổng trường xin tiền", emoji: "🥺", bucketId: "beg" },
        ],
        "Kéo thẻ vào nhóm đúng nhé!",
        "Giỏi quá! Kiếm tiền = bỏ sức ra để nhận tiền. Xin tiền = đòi mà không cho đi gì cả.",
      ),
    ],
  },
  {
    id: "earning-2",
    topicId: "earning",
    index: 2,
    title: "Lao động & giá trị",
    subtitle: "Mỗi công việc đều đáng trân trọng",
    ageGroup: ["8-11", "12-15"],
    xpReward: 30,
    coinReward: 15,
    questions: [
      mc(
        "ea2-q1",
        "Lao động là gì?",
        "define",
        [
          { id: "define", label: "Dùng sức, trí tuệ để tạo ra thứ có giá trị", emoji: "💪" },
          { id: "tired", label: "Là việc khiến mình mệt mỏi", emoji: "😩" },
          { id: "school", label: "Chỉ là đi học thôi", emoji: "🏫" },
        ],
        undefined,
        "Đúng! Lao động = làm ra giá trị. Mỗi công việc (kể cả lau nhà, nấu cơm) đều là lao động có giá trị.",
      ),
      drag(
        "ea2-q2",
        "Phân loại nghề theo cách dùng sức lao động:",
        [
          { id: "muscle", label: "Sức mạnh", emoji: "💪" },
          { id: "brain", label: "Trí tuệ", emoji: "🧠" },
          { id: "creative", label: "Sáng tạo", emoji: "🎨" },
        ],
        [
          { id: "i1", label: "Công nhân xây dựng", emoji: "🏗️", bucketId: "muscle" },
          { id: "i2", label: "Lập trình viên", emoji: "💻", bucketId: "brain" },
          { id: "i3", label: "Họa sĩ vẽ tranh", emoji: "🖼️", bucketId: "creative" },
          { id: "i4", label: "Bác sĩ khám bệnh", emoji: "🩺", bucketId: "brain" },
          { id: "i5", label: "Nông dân cấy lúa", emoji: "🌾", bucketId: "muscle" },
          { id: "i6", label: "Nhạc sĩ sáng tác", emoji: "🎵", bucketId: "creative" },
        ],
        undefined,
        "Tuyệt vời! Mỗi nghề dùng sức lao động khác nhau. Tất cả đều quý, không có nghề nào thấp hơn nghề nào!",
      ),
      tf(
        "ea2-q3",
        "Đúng hay sai?",
        "Để có nghề tốt sau này, học sinh cần học tập chăm chỉ ngay từ bây giờ.",
        true,
        "Đúng! Mỗi ngày đi học là bạn đang chuẩn bị cho nghề tương lai. Học tốt = nhiều lựa chọn nghề hơn.",
      ),
      mc(
        "ea2-q4",
        "Tại sao người lớn đi làm mỗi ngày dù đã có tiền?",
        "contribute",
        [
          { id: "boring", label: "Vì họ thích làm việc buồn tẻ", emoji: "🥱" },
          { id: "contribute", label: "Vì lao động mang lại giá trị & ý nghĩa cho cuộc sống", emoji: "🌟" },
          { id: "scared", label: "Vì họ sợ sếp đuổi việc", emoji: "😰" },
        ],
        undefined,
        "Đúng rồi! Lao động không chỉ để có tiền - nó còn cho mình cảm giác có ích, có mục đích sống. Đó là giá trị tinh thần to lớn.",
      ),
    ],
  },
  {
    id: "earning-3",
    topicId: "earning",
    index: 3,
    title: "Làm việc nhóm & chia tiền",
    subtitle: "Khi làm chung, chia tiền thế nào?",
    ageGroup: ["8-11", "12-15"],
    xpReward: 30,
    coinReward: 15,
    questions: [
      num(
        "ea3-q1",
        "3 bạn cùng nhặt ve chai bán được 30.000đ, chia đều. Mỗi bạn được bao nhiêu?",
        10000,
        "đồng",
        "Gợi ý: 30.000 ÷ 3 = ?",
        "Đúng rồi! 30.000 ÷ 3 = 10.000đ. Mỗi bạn được 10.000đ. Chia đều là công bằng khi làm chung!",
      ),
      num(
        "ea3-q2",
        "4 bạn cùng làm bánh, bán được 80.000đ. Chia đều. Mỗi bạn được bao nhiêu?",
        20000,
        "đồng",
        "Gợi ý: 80.000 ÷ 4 = ?",
        "Chính xác! 80.000 ÷ 4 = 20.000đ. Toán nhanh quá!",
      ),
      mc(
        "ea3-q3",
        "Bạn A làm 3 giờ, bạn B làm 1 giờ, cùng nhận 40.000đ. Chia thế nào công bằng?",
        "ratio",
        [
          { id: "equal", label: "Chia đều 20.000đ mỗi bạn", emoji: "🤝" },
          { id: "ratio", label: "A được 30.000đ, B được 10.000đ (theo thời gian)", emoji: "⏱️" },
          { id: "all-a", label: "Bạn A được hết 40.000đ vì làm nhiều hơn", emoji: "🏆" },
        ],
        undefined,
        "Tuyệt vời! Công bằng không phải lúc nào cũng là chia đều - mà là theo công sức đóng góp. 3:1 = 30:10 là hợp lý.",
      ),
      tf(
        "ea3-q4",
        "Đúng hay sai?",
        "Khi làm việc nhóm, chỉ cần chia tiền đều là công bằng, không cần tính công sức mỗi người.",
        false,
        "Sai! Công bằng là theo công sức đóng góp, không phải chia đều. Nếu 1 bạn làm 90% việc, họ xứng đáng nhận nhiều hơn.",
      ),
    ],
  },
];

/* ============================================================
 * TOPIC 5 – An toàn tài chính (12-15 tuổi)
 * ============================================================ */
const safetyLessons: Lesson[] = [
  {
    id: "safety-1",
    topicId: "safety",
    index: 1,
    title: "Bảo vệ tiền của mình",
    subtitle: "Cảnh giác lừa đảo & giữ bí mật tài khoản",
    ageGroup: ["12-15"],
    xpReward: 35,
    coinReward: 18,
    questions: [
      mc(
        "sf1-q1",
        "Bạn nhận được tin nhắn: 'Chúc mừng! Bạn trúng thưởng 50 triệu. Click link để nhận'. Bạn nên?",
        "ignore",
        [
          { id: "click", label: "Click ngay vào link để nhận", emoji: "🖱️" },
          { id: "ignore", label: "Bỏ qua - đây là lừa đảo", emoji: "🚫" },
          { id: "reply", label: "Trả lời để hỏi thêm chi tiết", emoji: "💬" },
        ],
        "Tin nhắn trúng thưởng bất ngờ hầu như luôn là lừa đảo!",
        "Đúng rồi! 99% tin nhắn 'trúng thưởng' là lừa đảo. Không click link lạ, không gửi thông tin cá nhân.",
      ),
      tf(
        "sf1-q2",
        "Đúng hay sai?",
        "Mật khẩu ngân hàng có thể chia sẻ với bạn thân để tiện chuyển tiền.",
        false,
        "Sai! Mật khẩu là của mình, không ai được biết - kể cả bạn thân, người yêu, hay bất kỳ ai. Đây là quy tắc số 1 về an toàn tài chính.",
      ),
      mc(
        "sf1-q3",
        "OTP (mã xác nhận) từ ngân hàng gửi về điện thoại. Bạn nên xử lý thế nào?",
        "keep-secret",
        [
          { id: "share", label: "Đọc cho nhân viên ngân hàng nghe để xác nhận", emoji: "📞" },
          { id: "keep-secret", label: "Giữ bí mật tuyệt đối, không cho ai biết", emoji: "🤐" },
          { id: "screenshot", label: "Chụp ảnh gửi bạn bè xem", emoji: "📸" },
        ],
        "Nhân viên ngân hàng chính thức KHÔNG BAO GIỜ hỏi OTP của bạn!",
        "Chính xác! OTP là chìa khóa bảo vệ tài khoản. Ngân hàng không bao giờ hỏi OTP qua điện thoại. Nếu ai hỏi → lừa đảo 100%.",
      ),
      drag(
        "sf1-q4",
        "Phân loại tình huống: AN TOÀN hay NGUY HIỂM?",
        [
          { id: "safe", label: "An toàn", emoji: "🛡️" },
          { id: "danger", label: "Nguy hiểm", emoji: "⚠️" },
        ],
        [
          { id: "i1", label: "Dùng app ngân hàng chính hãng từ App Store", emoji: "✅", bucketId: "safe" },
          { id: "i2", label: "Nhập mật khẩu ngân hàng vào link từ email lạ", emoji: "❌", bucketId: "danger" },
          { id: "i3", label: "Đăng xuất tài khoản khi dùng máy tính công cộng", emoji: "✅", bucketId: "safe" },
          { id: "i4", label: "Gửi ảnh CCCD cho người lạ trên mạng", emoji: "❌", bucketId: "danger" },
          { id: "i5", label: "Bật xác thực 2 lớp cho tài khoản quan trọng", emoji: "✅", bucketId: "safe" },
          { id: "i6", label: "Đăng nhập ngân hàng trên WiFi công cộng", emoji: "❌", bucketId: "danger" },
        ],
        "Cẩn thận với những tình huống nguy hiểm nhé!",
        "Bạn có đôi mắt tinh tường! Bảo vệ tài khoản = bảo vệ tiền của mình. Luôn cảnh giác trên không gian mạng.",
      ),
    ],
  },
  {
    id: "safety-2",
    topicId: "safety",
    index: 2,
    title: "Quỹ dự phòng",
    subtitle: "Cứu cánh cho tình huống bất ngờ",
    ageGroup: ["12-15"],
    xpReward: 30,
    coinReward: 15,
    questions: [
      mc(
        "sf2-q1",
        "Quỹ dự phòng là gì?",
        "emergency",
        [
          { id: "emergency", label: "Tiền để dành riêng cho tình huống khẩn cấp", emoji: "🚨" },
          { id: "shopping", label: "Tiền để đi mua sắm cuối tuần", emoji: "🛍️" },
          { id: "fun", label: "Tiền để đi chơi với bạn bè", emoji: "🎉" },
        ],
        undefined,
        "Đúng! Quỹ dự phòng là khoản tiền 'phòng khi có chuyện' - điện thoại hỏng, ốm đau, mất đồ... Tuyệt đối KHÔNG dùng để mua sắm.",
      ),
      num(
        "sf2-q2",
        "Bạn tiêu 1.000.000đ/tháng. Quỹ dự phòng nên có ÍT NHẤT bao nhiêu? (Quy tắc: 3 tháng chi phí)",
        3000000,
        "đồng",
        "Gợi ý: 1.000.000 × 3 = ?",
        "Chính xác! 1.000.000 × 3 = 3.000.000đ. Quy tắc 3-6 tháng chi phí giúp bạn an toàn khi mất việc hoặc ốm đau.",
      ),
      mc(
        "sf2-q3",
        "Trường hợp nào NÊN dùng quỹ dự phòng?",
        "phone-broken",
        [
          { id: "phone-broken", label: "Điện thoại rơi vỡ, cần mua cái mới gấp", emoji: "📱" },
          { id: "sale", label: "Giày sale giảm giá 50%", emoji: "👟" },
          { id: "birthday", label: "Sinh nhật bạn thân, cần mua quà đắt tiền", emoji: "🎂" },
        ],
        undefined,
        "Đúng! Điện thoại hỏng đột xuất là tình huống khẩn cấp thật sự. Còn giày sale hay quà sinh nhật thì KHÔNG - dùng tiền tiêu vặt thôi.",
      ),
      tf(
        "sf2-q4",
        "Đúng hay sai?",
        "Quỹ dự phòng chỉ dành cho người giàu, người nghèo không cần.",
        false,
        "Sai! Quỹ dự phòng CẦN THIẾT cho mọi người, đặc biệt người thu nhập thấp - vì họ dễ bị 'sập' khi có chi phí bất ngờ hơn.",
      ),
    ],
  },
  {
    id: "safety-3",
    topicId: "safety",
    index: 3,
    title: "Tránh 'tín dụng đen'",
    subtitle: "Cảnh giác cho vay nặng lãi",
    ageGroup: ["12-15"],
    xpReward: 35,
    coinReward: 18,
    questions: [
      mc(
        "sf3-q1",
        "Tín dụng đen là gì?",
        "loan-shark",
        [
          { id: "loan-shark", label: "Vay tiền với lãi suất cắt cổ, không hợp pháp", emoji: "🦈" },
          { id: "bank", label: "Vay tiền từ ngân hàng nhà nước", emoji: "🏦" },
          { id: "friend", label: "Mượn tiền bạn thân không lấy lãi", emoji: "🤝" },
        ],
        undefined,
        "Đúng! Tín dụng đen = cho vay nặng lãi, hoạt động chui, đe dọa người vay. TUYỆT ĐỐI không vay từ những nguồn này.",
      ),
      mc(
        "sf3-q2",
        "Một người rủ bạn: 'Vay 1 triệu, 1 tuần sau trả 1.5 triệu'. Bạn nghĩ gì?",
        "scam",
        [
          { id: "good", label: "Lãi tốt, vay thử đi", emoji: "💰" },
          { id: "scam", label: "Lãi 50%/tuần - quá cao, có dấu hiệu tín dụng đen", emoji: "🚨" },
          { id: "normal", label: "Bình thường, ai cũng vay thế", emoji: "🤷" },
        ],
        "Lãi 50% một tuần = lãi 2.600%/năm - vượt xa giới hạn pháp luật!",
        "Chính xác! Lãi 50%/tuần = 2.600%/năm. Pháp luật Việt Nam giới hạn lãi vay tối đa 20%/năm. Đây chắc chắn là tín dụng đen.",
      ),
      mc(
        "sf3-q3",
        "Khi cần tiền gấp để mua đồ cho bài kiểm tra, bạn nên?",
        "ask-parents",
        [
          { id: "loan-shark", label: "Vay tín dụng đen online", emoji: "📱" },
          { id: "ask-parents", label: "Nói với bố mẹ hoặc thầy cô", emoji: "👨‍👩‍👧" },
          { id: "skip", label: "Thôi không mua nữa", emoji: "🚫" },
        ],
        undefined,
        "Tuyệt vời! Bố mẹ, thầy cô LUÔN là người đầu tiên nên nhờ. Họ có thể giúp bạn tìm giải pháp tốt hơn, hoặc cho bạn mượn tiền không lãi.",
      ),
      drag(
        "sf3-q4",
        "Phân biệt: nguồn vay UY TÍN hay TÍN DỤNG ĐEN?",
        [
          { id: "trust", label: "Uy tín", emoji: "🏦" },
          { id: "loan-shark", label: "Tín dụng đen", emoji: "🦈" },
        ],
        [
          { id: "i1", label: "Ngân hàng nhà nước có giấy phép", emoji: "🏛️", bucketId: "trust" },
          { id: "i2", label: "App cho vay 'nhanh trong 5 phút' với lãi cắt cổ", emoji: "⚡", bucketId: "loan-shark" },
          { id: "i3", label: "Quỹ tín dụng nhân dân do nhà nước quản lý", emoji: "🤝", bucketId: "trust" },
          { id: "i4", label: "Người lạ cho vay tiền qua tin nhắn Zalo", emoji: "📱", bucketId: "loan-shark" },
          { id: "i5", label: "Công ty tài chính có giấy phép, hợp đồng rõ ràng", emoji: "📄", bucketId: "trust" },
          { id: "i6", label: "Bạn cầm CMND, ký giấy là có tiền liền", emoji: "📝", bucketId: "loan-shark" },
        ],
        undefined,
        "Bạn nhận biết rất tốt! Chỉ vay từ nguồn có giấy phép, hợp đồng rõ ràng. Tín dụng đen = bẫy nợ!",
      ),
    ],
  },
  {
    id: "safety-4",
    topicId: "safety",
    index: 4,
    title: "Lập ngân sách cá nhân",
    subtitle: "Quản lý thu chi - không bao giờ hết tiền giữa tháng",
    ageGroup: ["8-11", "12-15"],
    xpReward: 35,
    coinReward: 20,
    questions: [
      mc(
        "sf4-q1",
        "Ngân sách cá nhân là gì?",
        "plan",
        [
          { id: "plan", label: "Kế hoạch thu - chi trong 1 tuần/tháng", emoji: "📋" },
          { id: "wish", label: "Danh sách những thứ mình muốn mua", emoji: "🛒" },
          { id: "borrow", label: "Tiền mượn từ bố mẹ hàng tháng", emoji: "🤲" },
        ],
        undefined,
        "Chính xác! Ngân sách = kế hoạch quản lý tiền: thu nhập bao nhiêu, chi tiêu cho gì, tiết kiệm bao nhiêu. Có kế hoạch = không bao giờ hết tiền!",
      ),
      num(
        "sf4-q2",
        "Bạn có tiền tiêu vặt 100.000đ/tuần. Phân bổ: 50% tiết kiệm, 30% tiêu, 20% cho đi. Mỗi tuần bạn TIÊU bao nhiêu?",
        30000,
        "đồng",
        "Gợi ý: 100.000 × 30% = ?",
        "Đúng! 100.000 × 30% = 30.000đ tiêu/tuần. 50.000đ tiết kiệm, 20.000đ cho đi. Có ngân sách rõ ràng!",
      ),
      drag(
        "sf4-q3",
        "Phân loại chi tiêu: CẦN THIẾT vs MUỐN MUA:",
        [
          { id: "need", label: "Cần thiết", emoji: "✅" },
          { id: "want", label: "Muốn mua", emoji: "💖" },
        ],
        [
          { id: "i1", label: "Tiền cơm trưa ở trường", emoji: "🍱", bucketId: "need" },
          { id: "i2", label: "Mua bút máy limited 500k", emoji: "🖊️", bucketId: "want" },
          { id: "i3", label: "Sách giáo khoa học kỳ mới", emoji: "📖", bucketId: "need" },
          { id: "i4", label: "Mua đồ chơi mới ra", emoji: "🧸", bucketId: "want" },
          { id: "i5", label: "Tiền xe đưa đón hàng ngày", emoji: "🚌", bucketId: "need" },
          { id: "i6", label: "Đi xem phim cuối tuần", emoji: "🎬", bucketId: "want" },
        ],
        "Phân biệt rõ ràng giúp bạn tiêu tiền thông minh hơn!",
        "Bạn phân loại xuất sắc! NGUYÊN TẮC: Trước khi mua gì, tự hỏi 'CẦN hay MUỐN?'. Nếu là CẦN → mua. Nếu chỉ MUỐN → cân nhắc hoặc đợi.",
      ),
      mc(
        "sf4-q4",
        "Bạn đã chi hết tiền tiêu vặt tuần này nhưng còn 3 ngày nữa mới có tiền mới. Bạn nên?",
        "no-spend",
        [
          { id: "borrow-friend", label: "Mượn bạn 30k, hứa trả tuần sau", emoji: "🤝" },
          { id: "no-spend", label: "Chịu khó không tiêu gì thêm 3 ngày", emoji: "🚫" },
          { id: "ask-parents", label: "Xin thêm mẹ 50k vì hết tiền", emoji: "😢" },
        ],
        undefined,
        "Tuyệt vời! Đây là kỷ luật tài chính tốt nhất. Tiêu hết = chịu khó 3 ngày. Mượn bạn dễ tạo thói quen vay, xin thêm mẹ thì không học được cách quản lý.",
      ),
    ],
  },
  {
    id: "safety-5",
    topicId: "safety",
    index: 5,
    title: "Vay có trách nhiệm",
    subtitle: "Vay đúng cách - xây dựng uy tín tài chính",
    ageGroup: ["12-15"],
    xpReward: 35,
    coinReward: 20,
    questions: [
      mc(
        "sf5-q1",
        "Có phải lúc nào vay tiền cũng xấu?",
        "no",
        [
          { id: "no", label: "Không - vay đúng cách giúp mua nhà, học hành, khởi nghiệp", emoji: "✅" },
          { id: "yes", label: "Có - vay tiền lúc nào cũng xấu", emoji: "🚫" },
          { id: "rich-only", label: "Chỉ người giàu mới được vay", emoji: "💰" },
        ],
        undefined,
        "Đúng rồi! Vay không xấu nếu vay cho mục đích tốt (học hành, mua nhà) và có khả năng trả. Vay xấu khi vay để tiêu xài hoặc không có kế hoạch trả.",
      ),
      mc(
        "sf5-q2",
        "Trước khi vay tiền, điều quan trọng nhất cần làm là?",
        "repayment-plan",
        [
          { id: "borrow-fast", label: "Vay nhanh kẻo lỡ cơ hội", emoji: "💨" },
          { id: "no-plan", label: "Vay xong tính sau", emoji: "🤷" },
          { id: "repayment-plan", label: "Lập kế hoạch trả nợ rõ ràng trước", emoji: "📝" },
        ],
        "Vay mà không có kế hoạch trả = bẫy nợ!",
        "Chuẩn! Trước khi vay, PHẢI có kế hoạch trả: mỗi tháng trả bao nhiêu, từ nguồn nào, trong bao lâu. Không có kế hoạch = không vay.",
      ),
      num(
        "sf5-q3",
        "Bạn vay 1.200.000đ để mua xe đạp, trả góp 6 tháng, mỗi tháng trả đều. Mỗi tháng bạn trả bao nhiêu?",
        200000,
        "đồng",
        "Gợi ý: 1.200.000 ÷ 6 = ?",
        "Chính xác! 1.200.000 ÷ 6 = 200.000đ/tháng. Trả đều 6 tháng, không thiếu ngày nào - đó là uy tín tài chính!",
      ),
      tf(
        "sf5-q4",
        "Đúng hay sai?",
        "Vay tiền để mua đồ ăn vặt 5.000đ mỗi ngày là quyết định tài chính thông minh.",
        false,
        "Sai! Vay để mua đồ ăn vặt hàng ngày = xấu. Vay chỉ nên cho những thứ có giá trị LỚN và LÂU DÀI (xe đạp, học phí, máy tính). Đồ ăn vặt 5k/ngày = tiêu xài không cần vay.",
      ),
    ],
  },
];

/* ============================================================
 * TOPIC 6 – Đầu tư cơ bản (12-15 tuổi)
 * ============================================================ */
const investLessons: Lesson[] = [
  {
    id: "invest-1",
    topicId: "invest",
    index: 1,
    title: "Gửi tiết kiệm ngân hàng",
    subtitle: "Lãi suất đơn giản & cách tính lãi",
    ageGroup: ["12-15"],
    xpReward: 35,
    coinReward: 18,
    questions: [
      mc(
        "iv1-q1",
        "Lãi suất 6%/năm nghĩa là gì?",
        "interest-amount",
        [
          { id: "interest-amount", label: "Gửi 1 triệu, 1 năm nhận 60.000đ lãi", emoji: "💵" },
          { id: "free-money", label: "Gửi 1 triệu, nhận lại 1.06 triệu ngay lập tức", emoji: "💸" },
          { id: "tax", label: "Ngân hàng giữ 6% tiền của mình", emoji: "🏛️" },
        ],
        undefined,
        "Đúng! Lãi suất 6%/năm = 1 triệu gửi 1 năm nhận 60.000đ tiền lãi (gửi cuối kỳ) hoặc 30.000đ (gửi đầu kỳ). Đơn giản!",
      ),
      num(
        "iv1-q2",
        "Bạn gửi tiết kiệm 5.000.000đ, lãi 6%/năm, gửi cuối kỳ. Sau 1 năm bạn nhận được bao nhiêu lãi?",
        300000,
        "đồng",
        "Gợi ý: 5.000.000 × 6% = ?",
        "Chính xác! 5.000.000 × 0.06 = 300.000đ lãi. Sau 1 năm tổng = 5.300.000đ.",
      ),
      mc(
        "iv1-q3",
        "Hai ngân hàng cùng lãi 6%/năm. Bạn nên chọn ngân hàng nào?",
        "big-bank",
        [
          { id: "small-bank", label: "Ngân hàng nhỏ, mới thành lập, vì lãi có thể cao hơn", emoji: "🏚️" },
          { id: "big-bank", label: "Ngân hàng lớn, uy tín lâu năm, có bảo hiểm tiền gửi", emoji: "🏛️" },
          { id: "random", label: "Chọn đại ngân hàng nào cũng được", emoji: "🎲" },
        ],
        undefined,
        "Đúng rồi! Lãi tương đương, hãy chọn ngân hàng lớn, uy tín - quan trọng nhất là có BẢO HIỂM TIỀN GỬI. Nếu ngân hàng phá sản, tiền vẫn được hoàn!",
      ),
      tf(
        "iv1-q4",
        "Đúng hay sai?",
        "Lãi suất tiết kiệm càng cao càng tốt, không cần quan tâm rủi ro.",
        false,
        "Sai! Lãi cao = rủi ro cao. Nếu một nơi trả lãi gấp đôi ngân hàng nhà nước mà không rõ nguồn gốc, đó có thể là lừa đảo!",
      ),
    ],
  },
  {
    id: "invest-2",
    topicId: "invest",
    index: 2,
    title: "Lãi kép - Sức mạnh thời gian",
    subtitle: "Lãi mẹ đẻ lãi con, hành trình 10-20 năm",
    ageGroup: ["12-15"],
    xpReward: 40,
    coinReward: 22,
    questions: [
      num(
        "iv2-q1",
        "Bạn gửi 1.000.000đ, lãi 10%/năm, KHÔNG rút. Sau 2 năm (lãi kép) bạn có bao nhiêu?",
        1210000,
        "đồng",
        "Gợi ý: Năm 1: 1.100.000đ. Năm 2: 1.100.000 × 1.1 = ?",
        "Đỉnh cao! 1.100.000 × 1.1 = 1.210.000đ. Sức mạnh lãi kép!",
      ),
      mc(
        "iv2-q2",
        "Lãi kép hoạt động thế nào?",
        "compound-def",
        [
          { id: "compound-def", label: "Lãi năm trước cộng vào gốc, năm sau tính lãi trên tổng", emoji: "📈" },
          { id: "double", label: "Lãi gấp đôi mỗi năm", emoji: "✨" },
          { id: "random", label: "Ngân hàng random lãi", emoji: "🎲" },
        ],
        undefined,
        "Đúng! Lãi kép = lãi mẹ đẻ lãi con. Năm 1 có lãi → cộng vào gốc → năm 2 lãi trên tổng lớn hơn. Càng lâu càng tăng tốc!",
      ),
      num(
        "iv2-q3",
        "Gửi 1.000.000đ, lãi 10%/năm, KHÔNG rút. Sau 5 năm (lãi kép) bạn có khoảng bao nhiêu? (Làm tròn nghìn)",
        1611000,
        "đồng",
        "Gợi ý: Nhân 1.1 liên tiếp 5 lần: 1 × 1.1 × 1.1 × 1.1 × 1.1 × 1.1",
        "Đúng rồi! 1 triệu → 1.61 triệu sau 5 năm. Lãi kép không nhanh, nhưng KIÊN TRÌ sẽ thấy sức mạnh!",
      ),
      mc(
        "iv2-q4",
        "Để lãi kép phát huy tối đa, yếu tố nào quan trọng nhất?",
        "start-early",
        [
          { id: "rich", label: "Phải giàu mới gửi được nhiều", emoji: "💰" },
          { id: "start-early", label: "Bắt đầu sớm & kiên trì không rút", emoji: "⏰" },
          { id: "lucky", label: "Phải may mắn", emoji: "🍀" },
        ],
        undefined,
        "Chuẩn! Einstein từng nói: 'Lãi kép là kỳ quan thứ 8 của thế giới'. Bí quyết: BẮT ĐẦU SỚM + KIÊN TRÌ. 100k/tháng từ 15 tuổi có thể thành tỷ phú ở tuổi 50!",
      ),
    ],
  },
  {
    id: "invest-3",
    topicId: "invest",
    index: 3,
    title: "Cổ phiếu, trái phiếu là gì?",
    subtitle: "Làm quen với các sản phẩm đầu tư",
    ageGroup: ["12-15"],
    xpReward: 40,
    coinReward: 22,
    questions: [
      mc(
        "iv3-q1",
        "Cổ phiếu là gì?",
        "ownership",
        [
          { id: "ownership", label: "Một phần sở hữu nhỏ của công ty", emoji: "🏢" },
          { id: "loan", label: "Một khoản vay cho công ty", emoji: "💳" },
          { id: "lottery", label: "Một tờ vé số", emoji: "🎟️" },
        ],
        undefined,
        "Đúng! Mua cổ phiếu = mua một phần nhỏ công ty. Công ty lời → bạn được chia lợi nhuận. Công ty lỗ → bạn mất tiền.",
      ),
      drag(
        "iv3-q2",
        "Phân loại: mức RỦI RO từ thấp → cao:",
        [
          { id: "low", label: "Rủi ro thấp", emoji: "🟢" },
          { id: "med", label: "Rủi ro trung bình", emoji: "🟡" },
          { id: "high", label: "Rủi ro cao", emoji: "🔴" },
        ],
        [
          { id: "i1", label: "Tiết kiệm ngân hàng", emoji: "🐖", bucketId: "low" },
          { id: "i2", label: "Trái phiếu chính phủ", emoji: "📜", bucketId: "low" },
          { id: "i3", label: "Quỹ mở (ETF, quỹ đầu tư)", emoji: "📊", bucketId: "med" },
          { id: "i4", label: "Cổ phiếu blue-chip (Vinamilk, FPT...)", emoji: "🏢", bucketId: "med" },
          { id: "i5", label: "Cổ phiếu penny (giá rẻ, ít người biết)", emoji: "🎲", bucketId: "high" },
          { id: "i6", label: "Crypto, forex, coin số", emoji: "💱", bucketId: "high" },
        ],
        undefined,
        "Bạn nắm vững kiến thức rồi! Quy tắc: lãi cao = rủi ro cao. Người mới nên bắt đầu từ thấp, tăng dần khi hiểu biết.",
      ),
      tf(
        "iv3-q3",
        "Đúng hay sai?",
        "Cổ phiếu luôn tăng giá theo thời gian, không bao giờ mất giá.",
        false,
        "Sai! Cổ phiếu có thể tăng HOẶC giảm. Lịch sử có nhiều vụ crash (dot-com 2000, 2008, COVID 2020) - nhà đầu tư mất 50-80% giá trị. Không bao giờ chắc chắn 100%!",
      ),
      mc(
        "iv3-q4",
        "Đa dạng hóa danh mục đầu tư nghĩa là gì?",
        "spread",
        [
          { id: "all-one", label: "Bỏ hết tiền vào 1 cổ phiếu để lãi to", emoji: "🎯" },
          { id: "spread", label: "Chia tiền vào nhiều loại khác nhau để giảm rủi ro", emoji: "🌈" },
          { id: "random", label: "Mua bất kỳ thứ gì thấy trên mạng", emoji: "🛒" },
        ],
        undefined,
        "Đúng! Đa dạng hóa = 'đừng bỏ trứng vào 1 giỏ'. Chia tiền vào 5-10 loại tài sản khác nhau, khi 1 cái giảm, các cái khác có thể tăng để bù.",
      ),
    ],
  },
];

/* ---------- Build topics from above ---------- */
export const TOPICS: Topic[] = [
  {
    id: "money",
    title: "Tiền là gì?",
    emoji: "💵",
    color: "green",
    description: "Khám phá nguồn gốc, mệnh giá & công dụng của tiền",
    lessons: moneyLessons,
  },
  {
    id: "needs-wants",
    title: "Nhu cầu & Mong muốn",
    emoji: "🎯",
    color: "blue",
    description: "Phân biệt thứ cần thiết và thứ chỉ là thích",
    lessons: needsWantsLessons,
  },
  {
    id: "saving",
    title: "Tiết kiệm thông minh",
    emoji: "🐷",
    color: "yellow",
    description: "Đặt mục tiêu, xây heo đất & khám phá lãi kép",
    lessons: savingLessons,
  },
  {
    id: "earning",
    title: "Kiếm tiền & Nghề nghiệp",
    emoji: "💼",
    color: "orange",
    description: "Tiền từ đâu, lao động & cách chia tiền khi làm nhóm",
    lessons: earningLessons,
  },
  {
    id: "safety",
    title: "An toàn tài chính",
    emoji: "🛡️",
    color: "red",
    description: "Bảo vệ tài khoản, quỹ dự phòng & tránh tín dụng đen",
    lessons: safetyLessons,
  },
  {
    id: "invest",
    title: "Đầu tư cơ bản",
    emoji: "📈",
    color: "purple",
    description: "Gửi tiết kiệm ngân hàng, lãi kép, cổ phiếu & trái phiếu",
    lessons: investLessons,
  },
];

/** Flat lookup of all lessons. */
export const ALL_LESSONS: Lesson[] = TOPICS.flatMap((t) => t.lessons);

export function getLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getNextLesson(id: string): Lesson | undefined {
  const idx = ALL_LESSONS.findIndex((l) => l.id === id);
  if (idx < 0 || idx === ALL_LESSONS.length - 1) return undefined;
  return ALL_LESSONS[idx + 1];
}

export function getTopicOfLesson(lessonId: string): Topic | undefined {
  return TOPICS.find((t) =>
    t.lessons.some((l) => l.id === lessonId),
  );
}

/* ---------- Badges ---------- */
export const BADGES: Badge[] = [
  {
    id: "first-step",
    name: "Bước đầu tiên",
    description: "Hoàn thành bài học đầu tiên",
    emoji: "🌱",
    condition: (s) => s.completedLessons.length >= 1,
  },
  {
    id: "streak-3",
    name: "Ba ngày liên tục",
    description: "Duy trì streak 3 ngày",
    emoji: "🔥",
    condition: (s) => s.streak >= 3,
  },
  {
    id: "streak-7",
    name: "Một tuần kiên trì",
    description: "Duy trì streak 7 ngày",
    emoji: "🔥",
    condition: (s) => s.streak >= 7,
  },
  {
    id: "money-master",
    name: "Chuyên gia tiền tệ",
    description: "Hoàn thành chủ đề 'Tiền là gì?'",
    emoji: "💰",
    condition: (s) =>
      moneyLessons.every((l) => s.completedLessons.includes(l.id)),
  },
  {
    id: "smart-shopper",
    name: "Người mua sắm thông minh",
    description: "Hoàn thành chủ đề 'Nhu cầu & Mong muốn'",
    emoji: "🛍️",
    condition: (s) =>
      needsWantsLessons.every((l) => s.completedLessons.includes(l.id)),
  },
  {
    id: "saver-pro",
    name: "Cao thủ tiết kiệm",
    description: "Hoàn thành chủ đề 'Tiết kiệm thông minh'",
    emoji: "🐖",
    condition: (s) =>
      savingLessons.every((l) => s.completedLessons.includes(l.id)),
  },
  {
    id: "rich-100",
    name: "Trăm xu đầu tiên",
    description: "Tích lũy 100 xu",
    emoji: "🪙",
    condition: (s) => s.coins >= 100,
  },
  {
    id: "xp-100",
    name: "Học giả tí hon",
    description: "Đạt 100 XP",
    emoji: "🎓",
    condition: (s) => s.xp >= 100,
  },
  {
    id: "earn-master",
    name: "Bậc thầy kiếm tiền",
    description: "Hoàn thành chủ đề 'Kiếm tiền & Nghề nghiệp'",
    emoji: "💼",
    condition: (s) =>
      earningLessons.every((l) => s.completedLessons.includes(l.id)),
  },
  {
    id: "safety-guard",
    name: "Vệ sĩ tài chính",
    description: "Hoàn thành chủ đề 'An toàn tài chính'",
    emoji: "🛡️",
    condition: (s) =>
      safetyLessons.every((l) => s.completedLessons.includes(l.id)),
  },
  {
    id: "investor-rookie",
    name: "Nhà đầu tư nhí",
    description: "Hoàn thành chủ đề 'Đầu tư cơ bản'",
    emoji: "📈",
    condition: (s) =>
      investLessons.every((l) => s.completedLessons.includes(l.id)),
  },
  {
    id: "scholar-200",
    name: "Học bá tập sự",
    description: "Đạt 200 XP",
    emoji: "📚",
    condition: (s) => s.xp >= 200,
  },
  {
    id: "completionist",
    name: "Hoàn thành xuất sắc",
    description: "Hoàn thành tất cả 18 bài học",
    emoji: "🏆",
    condition: (s) => s.completedLessons.length >= 18,
  },
];
