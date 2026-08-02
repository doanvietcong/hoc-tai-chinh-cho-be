"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  Star,
  Coins,
  Flame,
  Trophy,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  Heart,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Penguin } from "@/components/mascot/Penguin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge as BadgeUI } from "@/components/ui/Badge";
import { useProgress } from "@/lib/store";
import { useMounted } from "@/components/useMounted";
import { ALL_LESSONS, BADGES, TOPICS } from "@/lib/lessons";

const PARENT_PIN = "1234"; // MVP: PIN cố định. Sau này cho phụ huynh tự đặt.
const STORAGE_KEY = "pe-ti-parent-pin";

export default function ParentPage() {
  const mounted = useMounted();
  const user = useProgress((s) => s.user);
  const xp = useProgress((s) => s.xp);
  const coins = useProgress((s) => s.coins);
  const hearts = useProgress((s) => s.hearts);
  const maxHearts = useProgress((s) => s.maxHearts);
  const streak = useProgress((s) => s.streak);
  const lastLessonDate = useProgress((s) => s.lastLessonDate);
  const completed = useProgress((s) => s.completedLessons);
  const badges = useProgress((s) => s.badges);
  const totalCorrect = useProgress((s) => s.totalCorrect);
  const totalAnswered = useProgress((s) => s.totalAnswered);
  const soundEnabled = useProgress((s) => s.soundEnabled);

  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Check if already unlocked in this session
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem("pe-ti-parent-unlocked");
    if (stored === "1") setUnlocked(true);
  }, []);

  function tryUnlock() {
    if (pin === PARENT_PIN) {
      setUnlocked(true);
      setPinError(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pe-ti-parent-unlocked", "1");
      }
    } else {
      setPinError(true);
      setPin("");
    }
  }

  if (!mounted || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Đang tải...</p>
      </main>
    );
  }

  const accuracy =
    totalAnswered > 0
      ? Math.round((totalCorrect / totalAnswered) * 100)
      : 0;
  const completionPct = Math.round(
    (completed.length / ALL_LESSONS.length) * 100,
  );

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#f0e0ff] via-white to-[#d6f0fb] flex flex-col">
        <header className="bg-white border-b-2 border-[color:var(--color-border)]">
          <div className="mx-auto max-w-2xl px-3 sm:px-5 h-14 flex items-center justify-between">
            <Link
              href="/home"
              className="text-text-muted hover:text-[color:var(--color-text)] flex items-center gap-1.5 text-sm font-semibold"
            >
              <ArrowLeft size={20} /> Trang chủ
            </Link>
            <h1 className="font-extrabold text-brand-purple">
              👨‍👩‍👧 Khu vực phụ huynh
            </h1>
            <div className="w-16" />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm"
          >
            <Card className="text-center">
              <div className="text-6xl mb-2">🔒</div>
              <h2 className="text-xl font-extrabold mb-1">
                Nhập mã PIN phụ huynh
              </h2>
              <p className="text-xs text-text-muted mb-4">
                Khu vực này chỉ dành cho phụ huynh / giám hộ để xem tiến độ học tập của bé.
              </p>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPinError(false);
                  setPin(e.target.value.replace(/\D/g, ""));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && pin.length >= 4) tryUnlock();
                }}
                placeholder="••••"
                className={cn(
                  "w-full text-center text-2xl tracking-[0.5em] font-extrabold h-14 rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-brand-purple/30",
                  pinError
                    ? "border-brand-red bg-[#ffe1e1]"
                    : "border-[color:var(--color-border-strong)] bg-white",
                )}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-brand-red mt-2 font-bold">
                  Sai mã PIN. Mặc định: 1234
                </p>
              )}
              <Button
                size="lg"
                variant="primary"
                onClick={tryUnlock}
                fullWidth
                disabled={pin.length < 4}
                className="mt-3"
              >
                <Lock size={16} className="mr-1" /> Mở khóa
              </Button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="mt-2 text-[10px] text-text-muted hover:text-text flex items-center gap-1 mx-auto"
              >
                {showHint ? <EyeOff size={10} /> : <Eye size={10} />}
                {showHint ? "Ẩn gợi ý" : "Xem gợi ý (mặc định: 1234)"}
              </button>
            </Card>
          </motion.div>
        </div>
      </main>
    );
  }

  // ============ Unlocked Dashboard ============
  return (
    <main className="min-h-screen bg-[color:var(--color-surface)] pb-12">
      <header className="sticky top-0 z-20 bg-white border-b-2 border-[color:var(--color-border)]">
        <div className="mx-auto max-w-3xl px-3 sm:px-5 h-14 flex items-center justify-between">
          <Link
            href="/home"
            className="text-text-muted hover:text-[color:var(--color-text)] flex items-center gap-1.5 text-sm font-semibold"
          >
            <ArrowLeft size={20} /> Trang chủ
          </Link>
          <h1 className="font-extrabold text-brand-purple">
            👨‍👩‍👧 Phụ huynh
          </h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("pe-ti-parent-unlocked");
              setUnlocked(false);
              setPin("");
            }}
            className="text-xs text-text-muted hover:text-brand-red font-semibold"
          >
            Khóa
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-5">
        {/* Welcome */}
        <Card tone="purple">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <Penguin mood="wave" size={80} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold">
                Chào phụ huynh của {user.name}!
              </h2>
              <p className="text-sm text-text-muted">
                {user.age} tuổi · Nhóm {user.ageGroup} · Tham gia từ{" "}
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-xs text-text-soft mt-1 italic">
                Đây là bản xem tiến độ học tập - chỉ đọc, không chỉnh sửa được.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat
            label="Bài hoàn thành"
            value={`${completed.length}/${ALL_LESSONS.length}`}
            sub={`${completionPct}% chương trình`}
            icon={<CheckCircle2 className="text-brand-green" />}
          />
          <Stat
            label="Độ chính xác"
            value={`${accuracy}%`}
            sub={`${totalCorrect}/${totalAnswered} câu đúng`}
            icon={<TrendingUp className="text-brand-blue" />}
          />
          <Stat
            label="Streak"
            value={`${streak} ngày`}
            sub={
              lastLessonDate
                ? `Học gần nhất: ${formatRelativeDate(lastLessonDate)}`
                : "Chưa học lần nào"
            }
            icon={<Flame className="text-brand-orange" />}
          />
          <Stat
            label="Huy hiệu"
            value={`${badges.length}/${BADGES.length}`}
            sub="đã đạt được"
            icon={<Trophy className="text-brand-yellow" />}
          />
        </div>

        {/* XP/Coins/Hearts */}
        <Card>
          <h3 className="font-extrabold mb-3 flex items-center gap-1.5">
            <Star size={20} className="text-brand-blue" /> Tích lũy
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-extrabold text-brand-blue">{xp}</p>
              <p className="text-xs text-text-muted">XP (Kinh nghiệm)</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-brand-yellow-dark">
                {coins}
              </p>
              <p className="text-xs text-text-muted">Xu</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-brand-red">
                {hearts}/{maxHearts}
              </p>
              <p className="text-xs text-text-muted">Tim</p>
            </div>
          </div>
        </Card>

        {/* Settings snapshot */}
        <Card>
          <h3 className="font-extrabold mb-3">⚙️ Cài đặt</h3>
          <div className="text-sm space-y-1">
            <p>
              Âm thanh hiệu ứng:{" "}
              <b className={soundEnabled ? "text-brand-green" : "text-text-muted"}>
                {soundEnabled ? "BẬT" : "TẮT"}
              </b>
            </p>
            <p className="text-xs text-text-soft italic">
              Bé có thể tự bật/tắt trong Hồ sơ của bé.
            </p>
          </div>
        </Card>

        {/* Topic progress */}
        <Card>
          <h3 className="font-extrabold mb-3 flex items-center gap-1.5">
            <Award size={20} className="text-brand-purple" /> Tiến độ chủ đề
          </h3>
          <div className="space-y-3">
            {TOPICS.map((t) => {
              const done = t.lessons.filter((l) =>
                completed.includes(l.id),
              ).length;
              const pct = Math.round((done / t.lessons.length) * 100);
              return (
                <div key={t.id}>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>
                      {t.emoji} {t.title}
                    </span>
                    <span className="text-text-muted">
                      {done}/{t.lessons.length}
                    </span>
                  </div>
                  <div className="mt-1 w-full h-2 bg-[color:var(--color-surface-2)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-green transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent lessons */}
        <Card>
          <h3 className="font-extrabold mb-3 flex items-center gap-1.5">
            <Calendar size={20} className="text-brand-blue" /> Hoạt động gần đây
          </h3>
          {completed.length === 0 ? (
            <p className="text-sm text-text-muted italic">
              Bé chưa hoàn thành bài học nào. Hãy khuyến khích bé bắt đầu nhé!
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {completed.slice(-5).reverse().map((id) => {
                const lesson = ALL_LESSONS.find((l) => l.id === id);
                if (!lesson) return null;
                return (
                  <li
                    key={id}
                    className="flex items-center gap-2 rounded-lg bg-[color:var(--color-surface-2)] px-3 py-2"
                  >
                    <CheckCircle2 size={16} className="text-brand-green shrink-0" />
                    <span className="flex-1 truncate">
                      {lesson.title}
                    </span>
                    <span className="text-xs text-text-muted shrink-0">
                      +{lesson.xpReward} XP
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Badges */}
        <Card>
          <h3 className="font-extrabold mb-3 flex items-center gap-1.5">
            <Trophy size={20} className="text-brand-yellow" /> Huy hiệu ({badges.length}/{BADGES.length})
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {BADGES.map((b) => (
              <BadgeUI
                key={b.id}
                emoji={b.emoji}
                name={b.name}
                description={b.description}
                earned={badges.includes(b.id)}
                size="sm"
              />
            ))}
          </div>
        </Card>

        {/* Tips */}
        <Card tone="green">
          <h3 className="font-extrabold mb-2">💡 Gợi ý cho phụ huynh</h3>
          <ul className="text-sm space-y-1 list-disc pl-5">
            <li>
              Khuyến khích bé học <b>20-30 phút/ngày</b> thay vì học dồn.
            </li>
            <li>
              Hỏi bé câu hỏi thực tế: "Con muốn mua gì?", "Con tiết kiệm bao lâu rồi?"
            </li>
            <li>
              Dùng <b>tiền lì xì Tết</b> làm cơ hội thực hành chia 3 hũ.
            </li>
            <li>
              Để bé tự quyết định chi tiêu nhỏ (mua kem, sách) trong ngân sách.
            </li>
            <li>
              Đừng làm thay - hãy để bé tự trả lời câu hỏi, kể cả khi sai.
            </li>
          </ul>
        </Card>

        <p className="text-center text-xs text-text-soft">
          Pé Ti v1.0 · Made with 💚 in Vietnam
        </p>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-2 border-[color:var(--color-border)] bg-white p-3 text-center">
      {icon && <div className="flex justify-center mb-1">{icon}</div>}
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-[10px] text-text-muted leading-tight">{label}</p>
      {sub && <p className="text-[9px] text-text-soft mt-0.5">{sub}</p>}
    </div>
  );
}

function formatRelativeDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days === 0) return "Hôm nay";
    if (days === 1) return "Hôm qua";
    if (days < 7) return `${days} ngày trước`;
    return d.toLocaleDateString("vi-VN");
  } catch {
    return isoDate;
  }
}

// cn helper
function cn(...args: (string | undefined | false | null)[]) {
  return args.filter(Boolean).join(" ");
}
