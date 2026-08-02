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
];
