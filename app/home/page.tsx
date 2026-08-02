"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Settings, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Penguin } from "@/components/mascot/Penguin";
import { Hearts } from "@/components/ui/Hearts";
import { StreakBadge, CoinDisplay, XPDisplay } from "@/components/ui/Stats";
import { useProgress } from "@/lib/store";
import { ALL_LESSONS, TOPICS, getTopicOfLesson } from "@/lib/lessons";
import { cn } from "@/lib/utils";
import { useMounted } from "@/components/useMounted";

export default function HomePage() {
  const router = useRouter();
  const mounted = useMounted();
  const user = useProgress((s) => s.user);
  const hearts = useProgress((s) => s.hearts);
  const streak = useProgress((s) => s.streak);
  const coins = useProgress((s) => s.coins);
  const xp = useProgress((s) => s.xp);
  const completed = useProgress((s) => s.completedLessons);

  useEffect(() => {
    if (mounted && !user) router.replace("/");
  }, [mounted, user, router]);

  // Group lessons by topic for the zig-zag path
  const topicGroups = useMemo(() => {
    return TOPICS.map((topic) => ({
      topic,
      lessons: topic.lessons.map((l, idx) => ({
        ...l,
        status: completed.includes(l.id)
          ? ("done" as const)
          : idx === 0 || completed.includes(topic.lessons[idx - 1]?.id ?? "")
            ? ("open" as const)
            : ("locked" as const),
      })),
    }));
  }, [completed]);

  if (!mounted || !user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e8f8d8] via-white to-[#d6f0fb]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white border-b-2 border-[color:var(--color-border)]">
        <div className="mx-auto max-w-2xl px-3 sm:px-5 h-14 flex items-center justify-between gap-2">
          <Link
            href="/profile"
            className="flex items-center gap-2 group"
            aria-label="Hồ sơ"
          >
            <div className="w-9 h-9 rounded-full bg-[#e8f8d8] border-2 border-brand-green flex items-center justify-center font-bold text-brand-green-dark">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight">{user.name}</p>
              <p className="text-[10px] text-text-muted leading-tight">
                {user.age} tuổi · {user.ageGroup}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <StreakBadge days={streak} />
            <Hearts hearts={hearts} />
            <CoinDisplay coins={coins} />
          </div>
        </div>
      </header>

      {/* Welcome mascot */}
      <section className="mx-auto max-w-2xl px-4 pt-4 sm:pt-6 pb-2 flex items-center gap-3">
        <div className="shrink-0">
          <Penguin mood="happy" size={88} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-green-dark">
            Xin chào, {user.name}!
          </h1>
          <p className="text-sm text-text-muted">
            Sẵn sàng khám phá tiền cùng Pé Ti chưa? 🐧
          </p>
        </div>
      </section>

      {/* Level map */}
      <section className="mx-auto max-w-2xl px-4 pb-32">
        {topicGroups.map((group, topicIdx) => (
          <div key={group.topic.id} className="mb-8 last:mb-0">
            {/* Topic header */}
            <div
              className={cn(
                "rounded-2xl border-2 border-b-4 p-4 mb-4",
                group.topic.color === "green" && "bg-[#e8f8d8] border-brand-green",
                group.topic.color === "blue" && "bg-[#d6f0fb] border-brand-blue",
                group.topic.color === "yellow" && "bg-[#fff4cc] border-brand-yellow",
                group.topic.color === "purple" && "bg-[#f0e0ff] border-brand-purple",
                group.topic.color === "orange" && "bg-[#ffe1cc] border-brand-orange",
                group.topic.color === "pink" && "bg-[#ffe1f0] border-brand-pink",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{group.topic.emoji}</span>
                <div>
                  <h2 className="text-lg font-extrabold">
                    Chủ đề {topicIdx + 1}: {group.topic.title}
                  </h2>
                  <p className="text-sm text-text-muted">
                    {group.topic.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Zig-zag path */}
            <div className="relative pl-2">
              {/* vertical connecting line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-[color:var(--color-border)] rounded" />
              {group.lessons.map((lesson, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <LessonNode
                    key={lesson.id}
                    lesson={lesson}
                    status={lesson.status}
                    isLeft={isLeft}
                    topicColor={group.topic.color}
                    onClick={() => {
                      if (lesson.status === "locked") return;
                      router.push(`/lesson/${lesson.id}`);
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer hint */}
        <div className="mt-8 text-center text-sm text-text-muted">
          Hoàn thành bài trước để mở bài tiếp theo nhé! 🔓
        </div>
      </section>
    </main>
  );
}

interface LessonNodeProps {
  lesson: (typeof ALL_LESSONS)[number] & { status: "done" | "open" | "locked" };
  status: "done" | "open" | "locked";
  isLeft: boolean;
  topicColor: "green" | "blue" | "yellow" | "purple" | "orange" | "pink";
  onClick: () => void;
}

const colorRing: Record<LessonNodeProps["topicColor"], string> = {
  green: "border-brand-green",
  blue: "border-brand-blue",
  yellow: "border-brand-yellow",
  purple: "border-brand-purple",
  orange: "border-brand-orange",
  pink: "border-brand-pink",
};

function LessonNode({
  lesson,
  status,
  isLeft,
  topicColor,
  onClick,
}: LessonNodeProps) {
  const interactive = status !== "locked";

  return (
    <div
      className={cn(
        "relative flex items-center my-4 sm:my-6",
        isLeft ? "justify-start pr-[50%]" : "justify-end pl-[50%]",
      )}
    >
      <motion.button
        whileHover={interactive ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        onClick={onClick}
        disabled={status === "locked"}
        className={cn(
          "relative w-full max-w-[180px] rounded-3xl border-4 p-3 text-left shadow-[0_4px_0_rgba(0,0,0,0.1)]",
          "transition-all",
          status === "done" && "bg-white border-brand-green",
          status === "open" && cn("bg-white anim-float", colorRing[topicColor]),
          status === "locked" && "bg-[#f3f3f3] border-[color:var(--color-border)] opacity-70",
        )}
      >
        <div className="flex items-start gap-2">
          <div
            className={cn(
              "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white",
              status === "done" && "bg-brand-green",
              status === "open" &&
                (topicColor === "green"
                  ? "bg-brand-green"
                  : topicColor === "blue"
                    ? "bg-brand-blue"
                    : topicColor === "yellow"
                      ? "bg-brand-yellow text-[#3c3c3c]"
                      : topicColor === "purple"
                        ? "bg-brand-purple"
                        : topicColor === "orange"
                          ? "bg-brand-orange"
                          : "bg-brand-pink"),
              status === "locked" && "bg-[#cccccc]",
            )}
          >
            {status === "done" ? "✓" : status === "locked" ? "🔒" : lesson.index}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight line-clamp-2">
              {lesson.title}
            </p>
            <p className="text-[10px] text-text-muted leading-tight mt-0.5 line-clamp-2">
              {lesson.subtitle}
            </p>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
