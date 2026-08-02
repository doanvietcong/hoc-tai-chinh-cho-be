"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings, Award, Flame, Coins, Star, Trophy, Volume2, VolumeX, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge as BadgeUI } from "@/components/ui/Badge";
import { Penguin } from "@/components/mascot/Penguin";
import { useProgress } from "@/lib/store";
import { BADGES, ALL_LESSONS, TOPICS } from "@/lib/lessons";
import { useMounted } from "@/components/useMounted";
import { sfx, setSoundEnabled } from "@/lib/sounds";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const mounted = useMounted();
  const user = useProgress((s) => s.user);
  const xp = useProgress((s) => s.xp);
  const coins = useProgress((s) => s.coins);
  const streak = useProgress((s) => s.streak);
  const hearts = useProgress((s) => s.hearts);
  const badges = useProgress((s) => s.badges);
  const completed = useProgress((s) => s.completedLessons);
  const totalCorrect = useProgress((s) => s.totalCorrect);
  const totalAnswered = useProgress((s) => s.totalAnswered);
  const resetAll = useProgress((s) => s.resetAll);
  const resetUser = useProgress((s) => s.resetUser);
  const soundEnabled = useProgress((s) => s.soundEnabled);
  const setSound = useProgress((s) => s.setSoundEnabled);

  function toggleSound() {
    const next = !soundEnabled;
    setSound(next);
    setSoundEnabled(next);
    if (next) sfx.click();
  }

  useEffect(() => {
    if (mounted && !user) router.replace("/");
  }, [mounted, user, router]);

  if (!mounted || !user) return null;

  const accuracy =
    totalAnswered > 0
      ? Math.round((totalCorrect / totalAnswered) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-[color:var(--color-surface)] pb-12">
      <header className="sticky top-0 z-20 bg-white border-b-2 border-[color:var(--color-border)]">
        <div className="mx-auto max-w-2xl px-3 sm:px-5 h-14 flex items-center justify-between">
          <Link
            href="/home"
            className="text-text-muted hover:text-[color:var(--color-text)] flex items-center gap-1.5 text-sm font-semibold"
          >
            <ArrowLeft size={20} /> Trang chủ
          </Link>
          <h1 className="font-extrabold">Hồ sơ</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* Profile card */}
        <Card tone="green" className="text-center">
          <div className="flex justify-center mb-2">
            <Penguin mood="happy" size={100} />
          </div>
          <h2 className="text-2xl font-extrabold">{user.name}</h2>
          <p className="text-sm text-text-muted">
            {user.age} tuổi · Nhóm {user.ageGroup}
          </p>
          <p className="text-xs text-text-soft mt-1">
            Tham gia từ{" "}
            {new Date(user.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat icon={<Star className="text-brand-blue" fill="currentColor" />} label="XP" value={xp} />
          <Stat icon={<Coins className="text-brand-yellow" fill="currentColor" />} label="Xu" value={coins} />
          <Stat icon={<Flame className="text-brand-orange" fill="currentColor" />} label="Streak" value={`${streak} ngày`} />
          <Stat icon={<Trophy className="text-brand-green" fill="currentColor" />} label="Huy hiệu" value={badges.length} />
        </div>

        {/* Progress */}
        <Card>
          <h3 className="font-extrabold mb-3 flex items-center gap-1.5">
            <Award size={20} className="text-brand-purple" /> Tiến độ học tập
          </h3>
          <div className="space-y-2 text-sm">
            <Stat label="Bài đã hoàn thành" value={`${completed.length} / ${ALL_LESSONS.length}`} />
            <Stat label="Tỉ lệ chính xác" value={`${accuracy}%`} />
            <Stat label="Tổng câu đã trả lời" value={totalAnswered} />
            <Stat label="Tim hiện tại" value={`${hearts} / 5`} />
          </div>
        </Card>

        {/* Topics progress */}
        <Card>
          <h3 className="font-extrabold mb-3">📚 Chủ đề</h3>
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

        {/* Badges */}
        <Card>
          <h3 className="font-extrabold mb-3 flex items-center gap-1.5">
            <Trophy size={20} className="text-brand-yellow" /> Huy hiệu ({badges.length}/{BADGES.length})
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {BADGES.map((b) => (
              <BadgeUI
                key={b.id}
                emoji={b.emoji}
                name={b.name}
                description={b.description}
                earned={badges.includes(b.id)}
                size="md"
              />
            ))}
          </div>
        </Card>

        {/* Settings */}
        <Card>
          <h3 className="font-extrabold mb-3 flex items-center gap-1.5">
            <Settings size={20} /> Cài đặt
          </h3>
          <div className="space-y-2">
            <Link
              href="/parent"
              className="w-full flex items-center justify-between gap-3 px-3 h-12 rounded-2xl border-2 border-brand-purple bg-[#f0e0ff] hover:bg-[#e0c8ff] transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-brand-purple">
                <Users size={18} />
                Khu vực phụ huynh
              </span>
              <span className="text-xs text-brand-purple">→</span>
            </Link>
            <button
              onClick={toggleSound}
              className="w-full flex items-center justify-between gap-3 px-3 h-12 rounded-2xl border-2 border-[color:var(--color-border-strong)] bg-white hover:bg-surface transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                {soundEnabled ? (
                  <Volume2 size={18} className="text-brand-blue" />
                ) : (
                  <VolumeX size={18} className="text-text-muted" />
                )}
                Âm thanh hiệu ứng
              </span>
              <span
                className={cn(
                  "text-xs font-extrabold px-2 py-0.5 rounded-full",
                  soundEnabled
                    ? "bg-brand-green text-white"
                    : "bg-[color:var(--color-surface-2)] text-text-muted",
                )}
              >
                {soundEnabled ? "BẬT" : "TẮT"}
              </span>
            </button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                if (confirm("Đổi người chơi? Tiến trình hiện tại sẽ được giữ trên thiết bị này.")) {
                  resetUser();
                  router.push("/");
                }
              }}
            >
              Đổi tên / tuổi
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                if (
                  confirm(
                    "Xóa toàn bộ tiến trình? Hành động này không thể hoàn tác.",
                  )
                ) {
                  resetAll();
                  router.push("/");
                }
              }}
            >
              Xóa toàn bộ dữ liệu
            </Button>
          </div>
        </Card>

        <p className="text-center text-xs text-text-soft">
          Pé Ti – v1.0 · Made with 💚 in Vietnam
        </p>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border-2 border-[color:var(--color-border)] bg-white p-3 text-center">
      {icon && <div className="flex justify-center mb-1">{icon}</div>}
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}
