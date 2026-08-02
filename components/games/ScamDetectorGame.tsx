"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, RefreshCw, Award, AlertTriangle, CheckCircle2, Phone, Mail, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { sfx } from "@/lib/sounds";
import { cn, shuffle } from "@/lib/utils";

interface AdScenario {
  id: string;
  category: "social" | "shopping" | "banking" | "investing" | "phone";
  /** Brand/source display name */
  source: string;
  /** Source emoji */
  emoji: string;
  /** The advertisement text */
  text: string;
  /** Whether this is a scam or legit */
  isScam: boolean;
  /** Explanation shown after answering */
  explainer: string;
}

const AD_POOL: AdScenario[] = [
  // ===== SCAM =====
  {
    id: "scam1",
    category: "social",
    source: "Tin nhắn SMS",
    emoji: "💬",
    text: "🎉 CHÚC MỪNG! Bạn đã TRÚNG THƯỞNG iPhone 15 Pro Max! Click ngay: bit.ly/free-iphone-vn để nhận!",
    isScam: true,
    explainer:
      "Dấu hiệu lừa đảo: 'TRÚNG THƯỞNG' bất ngờ, link rút gọn lạ, giải thưởng quá hấp dẫn. Không có công ty nào tặng iPhone miễn phí qua SMS!",
  },
  {
    id: "scam2",
    category: "banking",
    source: "Tin nhắn ngân hàng",
    emoji: "🏦",
    text: "Ngân hàng XYZ thông báo: tài khoản bị KHÓA. Vui lòng gửi MÃ OTP và MẬT KHẨU để xác minh. Gọi 1900-xxx-xxx.",
    isScam: true,
    explainer:
      "Ngân hàng KHÔNG BAO GIỜ hỏi mật khẩu hay mã OTP qua tin nhắn/điện thoại. Đây là lừa đảo phishing. Cúp máy và gọi lại số chính thức của ngân hàng!",
  },
  {
    id: "scam3",
    category: "investing",
    source: "Quảng cáo Facebook",
    emoji: "💰",
    text: "ĐẦU TƯ 1 TRIỆU → NHẬN 100 TRIỆU chỉ sau 1 tháng! Cam kết lợi nhuận 9000%/năm. Đăng ký ngay!",
    isScam: true,
    explainer:
      "Không có kênh đầu tư nào lợi nhuận 9000%/năm - chỉ có LỪA ĐẢO! Cảnh giác với mọi lời 'cam kết lợi nhuận cao'. Đây là chiêu ponzi phổ biến.",
  },
  {
    id: "scam4",
    category: "banking",
    source: "Quảng cáo online",
    emoji: "💳",
    text: "VAY TIỀN 0% LÃI SUẤT, không cần thế chấp, giải ngân trong 5 phút! Duyệt tự động 100%!",
    isScam: true,
    explainer:
      "Vay 0% lãi suất + không cần thế chấp + duyệt 100% = TÍN DỤNG ĐEN. Lãi suất thật sẽ rất cao (200-400%/năm), kèm phí ẩn và đe dọa khi trả nợ.",
  },
  {
    id: "scam5",
    category: "phone",
    source: "Cuộc gọi",
    emoji: "📞",
    text: "Xin chào, con là An, đang cấp cứu ở bệnh viện, con gửi nhầm số. Mẹ/ba chuyển gấp 20 triệu qua tài khoản XXX giúp con!",
    isScam: true,
    explainer:
      "Đây là chiêu lừa 'gọi nhầm số' cực kỳ phổ biến. Cúp máy → gọi lại số của con để xác minh. TUYỆT ĐỐI không chuyển tiền khi chưa nói chuyện trực tiếp với con.",
  },
  {
    id: "scam6",
    category: "shopping",
    source: "Tin nhắn Zalo",
    emoji: "🛒",
    text: "FLASH SALE! iPhone 15 chỉ 500K! Mua ngay kẻo hết. Thanh toán trước 100% để giữ hàng.",
    isScam: true,
    explainer:
      "iPhone 15 giá thị trường 20+ triệu, bán 500K = lừa đảo. Đặc điểm: giá quá rẻ, yêu cầu chuyển khoản trước, ép mua gấp. Shop uy tín sẽ cho kiểm tra hàng trước khi thanh toán.",
  },

  // ===== LEGIT =====
  {
    id: "legit1",
    category: "shopping",
    source: "Shopee Official",
    emoji: "🛍️",
    text: "🎊 Sale sinh nhật Shopee 9.9! Giảm đến 50% cho hàng nghìn sản phẩm. Miễn phí vận chuyển đơn từ 50K. Xem ngay trên app!",
    isScam: false,
    explainer:
      "Đây là quảng cáo THẬT từ Shopee Official (có tích xanh). Có thời gian khuyến mãi rõ ràng, điều kiện minh bạch, từ nguồn đã xác minh. Giảm giá 50% là hợp lý, không phải 99%.",
  },
  {
    id: "legit2",
    category: "shopping",
    source: "Vinamilk Official",
    emoji: "🥛",
    text: "Vinamilk 100% Organic - sản phẩm đạt chuẩn Organic Châu Âu. Đã có mặt tại các siêu thị BigC, Co.opmart, VinMart trên toàn quốc.",
    isScam: false,
    explainer:
      "Quảng cáo THẬT từ thương hiệu lớn, có nguồn gốc rõ ràng, sản phẩm có thể kiểm chứng tại cửa hàng. Không yêu cầu chuyển tiền hay cung cấp thông tin cá nhân.",
  },
  {
    id: "legit3",
    category: "social",
    source: "Grab Official",
    emoji: "🚗",
    text: "Khuyến mãi GrabFood! Tặng 50K cho khách hàng mới qua mã FREEFOOD50. Áp dụng đến 30/9. Chi tiết trên app Grab.",
    isScam: false,
    explainer:
      "Khuyến mãi THẬT từ Grab (thương hiệu lớn, có tích xanh). Mã giảm giá áp dụng qua app chính thức, có thời hạn rõ ràng, điều kiện minh bạch.",
  },
  {
    id: "legit4",
    category: "banking",
    source: "VCBank App",
    emoji: "🏦",
    text: "VCB thông báo: Tài khoản của bạn vừa bị TRỪ 200,000đ lúc 14:30. Nếu không phải bạn, gọi 1900-545-415 (số chính thức).",
    isScam: false,
    explainer:
      "Đây là thông báo THẬT từ ngân hàng - chỉ THÔNG BÁO giao dịch, KHÔNG yêu cầu cung cấp mật khẩu/OTP. Số hotline là số chính thức trên website/app.",
  },
  {
    id: "legit5",
    category: "shopping",
    source: "Co.opmart",
    emoji: "🛒",
    text: "Chương trình KHUYẾN MÃI cuối tuần: Mua 2 tặng 1 sữa tươi Vinamilk. Áp dụng 23-24/9 tại tất cả siêu thị Co.opmart toàn quốc.",
    isScam: false,
    explainer:
      "Khuyến mãi THẬT từ siêu thị có thương hiệu rõ ràng. Khuyến mãi hợp lý (mua 2 tặng 1 chứ không phải mua 1 tặng 10), có thời gian cụ thể, áp dụng tại cửa hàng.",
  },
];

/* ============== Game Component ============== */

interface RoundResult {
  ad: AdScenario;
  userAnswer: boolean;
  correct: boolean;
}

export function ScamDetectorGame() {
  const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro");
  const [adQueue, setAdQueue] = useState<AdScenario[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    ad: AdScenario;
  } | null>(null);
  const [selected, setSelected] = useState<boolean | null>(null);

  const totalRounds = 5;

  function startGame() {
    const shuffled = shuffle(AD_POOL).slice(0, totalRounds);
    setAdQueue(shuffled);
    setQIdx(0);
    setScore(0);
    setStreak(0);
    setResults([]);
    setFeedback(null);
    setSelected(null);
    setPhase("playing");
    sfx.click();
  }

  function answer(isScamAnswer: boolean) {
    if (selected !== null) return;
    const ad = adQueue[qIdx];
    const correct = ad.isScam === isScamAnswer;
    setSelected(isScamAnswer);
    setFeedback({ isCorrect: correct, ad });
    setResults((r) => [...r, { ad, userAnswer: isScamAnswer, correct }]);
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      sfx.correct();
    } else {
      setStreak(0);
      sfx.wrong();
    }
  }

  function nextRound() {
    if (qIdx + 1 >= totalRounds) {
      setPhase("result");
      sfx.lessonComplete();
    } else {
      setQIdx((i) => i + 1);
      setSelected(null);
      setFeedback(null);
      sfx.scene();
    }
  }

  const accuracy = useMemo(
    () => (results.length === 0 ? 0 : Math.round((score / results.length) * 100)),
    [results.length, score],
  );

  const currentAd = adQueue[qIdx];

  return (
    <div className="space-y-4">
      {/* Intro */}
      {phase === "intro" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-2 border-[color:var(--color-border-strong)] bg-white p-6 sm:p-8 text-center"
        >
          <div className="text-6xl mb-3">🕵️</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Thám tử chống lừa đảo
          </h2>
          <p className="text-sm text-text-muted mb-4 max-w-md mx-auto">
            Em sẽ đọc các quảng cáo / tin nhắn. Nhiệm vụ: phân biệt đâu là THẬT, đâu là LỪA ĐẢO.
            <br />
            <b className="text-brand-purple">{totalRounds} vòng · 1 điểm/vòng đúng</b>
          </p>
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto mb-5 text-left">
            <div className="rounded-xl bg-[#ffe1e1] border-2 border-brand-red p-2 text-center">
              <ShieldAlert className="mx-auto text-brand-red" size={20} />
              <p className="text-xs font-extrabold mt-1">🚨 LỪA ĐẢO</p>
            </div>
            <div className="rounded-xl bg-[#d7ffb8] border-2 border-brand-green p-2 text-center">
              <Shield className="mx-auto text-brand-green" size={20} />
              <p className="text-xs font-extrabold mt-1">✅ THẬT</p>
            </div>
          </div>
          <Button size="xl" variant="primary" onClick={startGame}>
            Bắt đầu điều tra!
          </Button>
        </motion.div>
      )}

      {/* Playing */}
      {phase === "playing" && currentAd && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm font-bold">
            <span>
              Câu {qIdx + 1}/{totalRounds}
            </span>
            <span className="text-brand-green">Điểm: {score}</span>
          </div>
          <div className="h-1.5 bg-[color:var(--color-surface-2)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-green"
              initial={false}
              animate={{ width: `${((qIdx + 1) / totalRounds) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Ad card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAd.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "rounded-3xl border-4 p-5 sm:p-6",
                feedback
                  ? feedback.isCorrect
                    ? "bg-[#d7ffb8] border-brand-green"
                    : "bg-[#ffe1e1] border-brand-red"
                  : "bg-white border-[color:var(--color-border-strong)]",
              )}
            >
              <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-current border-opacity-20">
                <div className="text-3xl">{currentAd.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wide">
                    Quảng cáo từ
                  </p>
                  <p className="text-sm font-extrabold truncate">
                    {currentAd.source}
                  </p>
                </div>
                <CategoryBadge category={currentAd.category} />
              </div>
              <p className="text-base sm:text-lg font-semibold leading-relaxed">
                {currentAd.text}
              </p>

              {/* Action buttons OR feedback */}
              {!feedback ? (
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button
                    onClick={() => answer(true)}
                    className="rounded-2xl border-2 border-brand-red bg-[#ffe1e1] hover:bg-[#ffcdcd] p-4 text-center transition-all active:translate-y-0.5"
                  >
                    <ShieldAlert
                      className="mx-auto text-brand-red"
                      size={28}
                    />
                    <p className="text-sm font-extrabold text-brand-red-dark mt-1">
                      🚨 LỪA ĐẢO
                    </p>
                  </button>
                  <button
                    onClick={() => answer(false)}
                    className="rounded-2xl border-2 border-brand-green bg-[#d7ffb8] hover:bg-[#c4f5a0] p-4 text-center transition-all active:translate-y-0.5"
                  >
                    <Shield
                      className="mx-auto text-brand-green"
                      size={28}
                    />
                    <p className="text-sm font-extrabold text-brand-green-dark mt-1">
                      ✅ THẬT
                    </p>
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-5 space-y-3"
                >
                  <div
                    className={cn(
                      "rounded-2xl p-3 font-extrabold text-center",
                      feedback.isCorrect ? "bg-brand-green text-white" : "bg-brand-red text-white",
                    )}
                  >
                    {feedback.isCorrect ? (
                      <span>✓ Chính xác! +1 điểm</span>
                    ) : (
                      <span>
                        ✗ Sai rồi! Đáp án:{" "}
                        {feedback.ad.isScam ? "LỪA ĐẢO" : "THẬT"}
                      </span>
                    )}
                  </div>
                  <div className="rounded-2xl bg-white p-3 text-sm leading-relaxed">
                    <p className="font-bold mb-1 text-brand-purple">
                      💡 Phân tích:
                    </p>
                    {feedback.ad.explainer}
                  </div>
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={nextRound}
                    fullWidth
                  >
                    {qIdx + 1 >= totalRounds ? "Xem kết quả" : "Câu tiếp →"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {streak >= 2 && feedback === null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm font-extrabold text-brand-orange"
            >
              🔥 Streak {streak} — Thám tử tí hon!
            </motion.div>
          )}
        </div>
      )}

      {/* Result */}
      {phase === "result" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border-2 border-[color:var(--color-border-strong)] bg-white p-6 sm:p-8 text-center"
        >
          <div className="text-6xl mb-3">
            {accuracy >= 80 ? "🏆" : accuracy >= 60 ? "⭐" : "💪"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">
            {accuracy >= 80
              ? "Xuất sắc!"
              : accuracy >= 60
                ? "Làm tốt lắm!"
                : "Cố gắng hơn nhé!"}
          </h2>
          <p className="text-sm text-text-muted mb-5">
            Bạn đúng <b className="text-brand-green text-lg">{score}/{totalRounds}</b> câu
            ({accuracy}%)
          </p>

          <div className="text-left space-y-2 max-w-md mx-auto mb-5">
            {results.map((r, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl p-2 text-xs flex items-center gap-2 border-2",
                  r.correct
                    ? "bg-[#d7ffb8] border-brand-green"
                    : "bg-[#ffe1e1] border-brand-red",
                )}
              >
                <span className="text-lg shrink-0">
                  {r.correct ? "✅" : "❌"}
                </span>
                <span className="text-base">{r.ad.emoji}</span>
                <span className="font-extrabold">
                  {r.ad.isScam ? "LỪA ĐẢO" : "THẬT"}
                </span>
                <span className="text-text-muted truncate flex-1">
                  {r.ad.source}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              size="lg"
              variant="warning"
              onClick={startGame}
            >
              <RefreshCw size={16} className="mr-1" /> Chơi lại
            </Button>
            <Button
              size="lg"
              variant="primary"
              onClick={() => {
                sfx.click();
                setPhase("intro");
              }}
            >
              <Award size={16} className="mr-1" /> Xong
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function CategoryBadge({ category }: { category: AdScenario["category"] }) {
  const map = {
    social: { label: "MXH", color: "bg-brand-pink", icon: <Megaphone size={12} /> },
    shopping: { label: "Mua sắm", color: "bg-brand-blue", icon: <CheckCircle2 size={12} /> },
    banking: { label: "Ngân hàng", color: "bg-brand-green", icon: <Shield size={12} /> },
    investing: { label: "Đầu tư", color: "bg-brand-purple", icon: <AlertTriangle size={12} /> },
    phone: { label: "Điện thoại", color: "bg-brand-orange", icon: <Phone size={12} /> },
  };
  const m = map[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white shrink-0",
        m.color,
      )}
    >
      {m.icon}
      {m.label}
    </span>
  );
}
