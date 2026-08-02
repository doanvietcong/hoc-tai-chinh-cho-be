"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { HeartsRow } from "@/components/ui/Hearts";
import { CoinDisplay, XPDisplay } from "@/components/ui/Stats";
import { Penguin } from "@/components/mascot/Penguin";
import { SceneStoryPlayer } from "@/components/mascot/SceneStoryPlayer";
import { MultipleChoiceCard } from "@/components/lesson/cards/MultipleChoice";
import { TrueFalseCard } from "@/components/lesson/cards/TrueFalse";
import { InputNumberCard } from "@/components/lesson/cards/InputNumber";
import { DragSortCard } from "@/components/lesson/cards/DragSort";
import { FeedbackBar } from "@/components/lesson/FeedbackBar";
import {
  LessonComplete,
  CoinBurst,
} from "@/components/lesson/LessonComplete";
import {
  getLesson,
  getNextLesson,
  getTopicOfLesson,
  BADGES,
} from "@/lib/lessons";
import { getStoryForLesson } from "@/lib/stories";
import { useProgress } from "@/lib/store";
import { cn, shuffle } from "@/lib/utils";
import { useMounted } from "@/components/useMounted";
import type {
  DragSortQuestion,
  MultipleChoiceQuestion,
  Question,
  TrueFalseQuestion,
} from "@/lib/types";

type Phase = "intro" | "playing" | "complete";

export default function LessonClient({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const mounted = useMounted();

  const lesson = useMemo(() => getLesson(lessonId), [lessonId]);
  const topic = useMemo(
    () => (lesson ? getTopicOfLesson(lesson.id) : undefined),
    [lesson],
  );
  const nextLesson = useMemo(
    () => (lesson ? getNextLesson(lesson.id) : undefined),
    [lesson],
  );

  const user = useProgress((s) => s.user);
  const hearts = useProgress((s) => s.hearts);
  const startLesson = useProgress((s) => s.startLesson);
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const completeLesson = useProgress((s) => s.completeLesson);
  const refillHeart = useProgress((s) => s.refillHeart);
  const badges = useProgress((s) => s.badges);

  const [phase, setPhase] = useState<Phase>("intro");
  const [qIdx, setQIdx] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [newBadges, setNewBadges] = useState<
    { emoji: string; name: string }[]
  >([]);
  const [showCoinBurst, setShowCoinBurst] = useState(false);
  /** Guards against double-clicks on Kiểm tra / Tiếp tục. */
  const [busy, setBusy] = useState(false);
  /** Show full-screen story overlay (Pé Ti kể chuyện). */
  const [showStory, setShowStory] = useState(false);

  /** Story content for this lesson (if any). */
  const story = useMemo(
    () => (lesson ? getStoryForLesson(lesson.id) : undefined),
    [lesson],
  );

  // Per-question local state
  const [mcSelected, setMcSelected] = useState<string | null>(null);
  const [tfSelected, setTfSelected] = useState<boolean | null>(null);
  const [numValue, setNumValue] = useState<number | null>(null);
  const [sortValue, setSortValue] = useState<Record<string, string> | null>(
    null,
  );

  useEffect(() => {
    if (mounted && !user) router.replace("/");
  }, [mounted, user, router]);

  useEffect(() => {
    // Redirect to home if user tries to access a locked lesson.
    if (mounted && user && lesson) {
      const completed = useProgress.getState().completedLessons;
      const isDone = completed.includes(lesson.id);
      if (!isDone) {
        // Find topic this lesson belongs to
        const topic = getTopicOfLesson(lesson.id);
        if (topic) {
          // Check that all previous lessons in the same topic are done
          let blocked = false;
          for (const l of topic.lessons) {
            if (l.id === lesson.id) break;
            if (!completed.includes(l.id)) {
              blocked = true;
              break;
            }
          }
          if (blocked) {
            router.replace("/home");
          }
        }
      }
    }
  }, [mounted, user, lesson, router]);

  useEffect(() => {
    // Reset state when lesson id changes
    setPhase("intro");
    setQIdx(0);
    setIsChecked(false);
    setIsCorrect(null);
    setCorrectCount(0);
    setXpEarned(0);
    setCoinsEarned(0);
    setMcSelected(null);
    setTfSelected(null);
    setNumValue(null);
    setSortValue(null);
    setBusy(false);
  }, [lessonId]);

  if (!mounted || !lesson || !user) return null;

  const currentQ = lesson.questions[qIdx];
  const totalQ = lesson.questions.length;
  const progress = (qIdx) / totalQ;
  const isLastQ = qIdx === totalQ - 1;

  function startLessonHandler() {
    startLesson(lesson!.id);
    setPhase("playing");
  }

  /** Called when user checks an answer. Returns whether answer is correct. */
  function checkAnswer(): boolean {
    if (!currentQ || busy || isChecked) return false;
    setBusy(true);
    let correct = false;

    switch (currentQ.type) {
      case "multiple-choice": {
        if (!mcSelected) {
          setBusy(false);
          return false;
        }
        correct = mcSelected === currentQ.correctOptionId;
        break;
      }
      case "true-false": {
        if (tfSelected == null) {
          setBusy(false);
          return false;
        }
        correct = tfSelected === currentQ.correct;
        break;
      }
      case "input-number": {
        if (numValue == null) {
          setBusy(false);
          return false;
        }
        correct = numValue === currentQ.correctNumber;
        break;
      }
      case "drag-sort": {
        if (!sortValue) {
          setBusy(false);
          return false;
        }
        correct = currentQ.items.every(
          (it) => sortValue[it.id] === it.bucketId,
        );
        break;
      }
    }

    const xp = correct ? 5 : 0;
    const coins = correct ? 3 : 0;
    recordAnswer(lesson!.id, {
      questionId: currentQ.id,
      correct,
      attempts: 1,
      xpEarned: xp,
      coinsEarned: coins,
    });

    setIsCorrect(correct);
    setIsChecked(true);
    if (correct) setCorrectCount((c) => c + 1);
    setXpEarned((v) => v + xp);
    setCoinsEarned((v) => v + coins);
    if (correct) {
      setShowCoinBurst(true);
      setTimeout(() => setShowCoinBurst(false), 1100);
    }
    return correct;
  }

  function nextQuestion() {
    if (isLastQ) {
      // finish
      finishLesson();
    } else {
      setQIdx((i) => i + 1);
      setIsChecked(false);
      setIsCorrect(null);
      setMcSelected(null);
      setTfSelected(null);
      setNumValue(null);
      setSortValue(null);
    }
  }

  function finishLesson() {
    const perfect = correctCount === totalQ;
    // Snapshot badges BEFORE marking complete (so we can diff new ones)
    const before = new Set(badges);
    completeLesson(lesson!.id, perfect);
    // After store update, badges array will be different. Read fresh from store:
    // We rely on the useProgress subscription for new badges — easier: re-evaluate
    // badge conditions here from current state plus new event:
    // For simplicity just check BADGES that pass:
    const state = useProgress.getState();
    const newlyEarned = BADGES.filter(
      (b) => !before.has(b.id) && b.condition(state),
    );
    setNewBadges(
      newlyEarned.map((b) => ({ emoji: b.emoji, name: b.name })),
    );
    setPhase("complete");
  }

  function handleContinueAfterFeedback() {
    if (busy) return;
    setBusy(true);
    if (hearts <= 0) {
      // game over
      router.push("/home");
      return;
    }
    // Drag-sort: cho phép retry khi sai, KHÔNG mất thêm heart.
    // Heart đã trừ 1 lần khi user click "Kiểm tra" lần đầu.
    if (isCorrect === false && currentQ?.type === "drag-sort") {
      setIsChecked(false);
      setIsCorrect(null);
      setSortValue(null);
      setBusy(false);
      return;
    }
    nextQuestion();
    setTimeout(() => setBusy(false), 50);
  }

  function getCorrectAnswerText(): string {
    if (!currentQ) return "";
    switch (currentQ.type) {
      case "multiple-choice": {
        const opt = currentQ.options.find(
          (o) => o.id === currentQ.correctOptionId,
        );
        return opt?.label ?? "";
      }
      case "true-false":
        return currentQ.correct ? "Đúng" : "Sai";
      case "input-number":
        return `${currentQ.correctNumber}${currentQ.unit ? " " + currentQ.unit : ""}`;
      case "drag-sort":
        return "Bạn đã sắp xếp sai một số thẻ. Thử lại nhé!";
    }
  }

  function canCheckCurrent(): boolean {
    if (!currentQ) return false;
    switch (currentQ.type) {
      case "multiple-choice":
        return mcSelected != null;
      case "true-false":
        return tfSelected != null;
      case "input-number":
        return numValue != null;
      case "drag-sort":
        return (
          sortValue != null &&
          Object.keys(sortValue).length === currentQ.items.length
        );
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white border-b-2 border-[color:var(--color-border)]">
        <div className="mx-auto max-w-2xl px-3 sm:px-5 h-14 flex items-center gap-3">
          <button
            onClick={() => {
              if (phase === "playing") {
                if (!confirm("Bạn muốn thoát bài học? Tiến trình câu này sẽ không được lưu.")) {
                  return;
                }
              }
              router.push("/home");
            }}
            className="text-text-muted hover:text-[color:var(--color-text)] p-1"
            aria-label="Thoát"
          >
            <X size={26} />
          </button>
          <div className="flex-1">
            <ProgressBar value={progress} tone="green" />
          </div>
          <HeartsRow hearts={hearts} />
        </div>
      </header>

      {/* INTRO phase */}
      {phase === "intro" && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4 max-w-md"
          >
            <Penguin mood="celebrate" size={140} />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark">
              {lesson.title}
            </h1>
            <p className="text-text-muted">{lesson.subtitle}</p>

            {/* Story CTA — chỉ hiện khi lesson có story */}
            {story && (
              <motion.button
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                onClick={() => setShowStory(true)}
                className="w-full rounded-2xl border-2 border-brand-purple bg-[#f0e0ff] p-3 text-left hover:shadow-[0_3px_0_#a55fe0] transition-all flex items-center gap-3"
              >
                <div className="text-3xl shrink-0">📖</div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-brand-purple text-sm">
                    Nghe Pé Ti kể chuyện trước!
                  </p>
                  <p className="text-[11px] text-text-muted leading-tight">
                    ~{story.estDurationSec}s · Có hình minh họa chuyển động
                  </p>
                </div>
                <div className="text-brand-purple text-xl shrink-0">▶</div>
              </motion.button>
            )}

            <div className="rounded-2xl border-2 border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] p-4 text-sm">
              <p>
                📚 <b>{totalQ} câu hỏi</b>
              </p>
              <p className="mt-1">
                ⭐ Thưởng tối đa: <b>{lesson.xpReward} XP + {lesson.coinReward} xu</b>
              </p>
              <p className="mt-1 text-text-muted">
                Hoàn thành không sai để nhận thưởng hoàn hảo!
              </p>
            </div>
            <Button
              size="xl"
              variant="primary"
              onClick={startLessonHandler}
              fullWidth
              disabled={busy}
            >
              Bắt đầu!
            </Button>
            {story && (
              <button
                onClick={() => setShowStory(true)}
                className="text-xs text-text-muted hover:text-brand-purple underline underline-offset-2"
              >
                hoặc nghe Pé Ti kể chuyện
              </button>
            )}
          </motion.div>
        </div>
      )}

      {/* PLAYING phase */}
      {phase === "playing" && currentQ && (
        <div className="flex-1 mx-auto max-w-2xl w-full px-4 py-6 pb-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl sm:text-2xl font-extrabold text-balance">
                {currentQ.prompt}
              </h2>
              {currentQ.helperText && (
                <p className="text-sm text-text-muted mt-2 italic">
                  {currentQ.helperText}
                </p>
              )}

              {currentQ.type === "multiple-choice" && (
                <MultipleChoiceCard
                  question={currentQ as MultipleChoiceQuestion}
                  selectedOptionId={mcSelected}
                  isChecked={isChecked}
                  isCorrect={isCorrect}
                  onSelect={setMcSelected}
                />
              )}
              {currentQ.type === "true-false" && (
                <TrueFalseCard
                  question={currentQ as TrueFalseQuestion}
                  selected={tfSelected}
                  isChecked={isChecked}
                  onSelect={setTfSelected}
                />
              )}
              {currentQ.type === "input-number" && (
                <InputNumberCard
                  question={currentQ}
                  isChecked={isChecked}
                  isCorrect={isCorrect}
                  onCheck={setNumValue}
                />
              )}
              {currentQ.type === "drag-sort" && (
                <DragSortCard
                  question={currentQ as DragSortQuestion}
                  isChecked={isChecked}
                  isCorrect={isCorrect}
                  onCheck={setSortValue}
                />
              )}

              {!isChecked && currentQ.type !== "input-number" && currentQ.type !== "drag-sort" && (
                <div className="mt-6 flex justify-end">
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={checkAnswer}
                    disabled={!canCheckCurrent() || busy}
                  >
                    Kiểm tra
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <FeedbackBar
            show={isChecked}
            isCorrect={isCorrect ?? false}
            correctAnswer={getCorrectAnswerText()}
            explainer={currentQ.explainer}
            onContinue={handleContinueAfterFeedback}
            canContinue={!busy}
          />
        </div>
      )}

      {/* Out of hearts overlay */}
      {hearts <= 0 && phase === "playing" && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-brand-red p-6 max-w-sm w-full text-center">
            <h2 className="text-2xl font-extrabold text-brand-red-dark">
              Hết tim rồi! 💔
            </h2>
            <p className="text-text-muted mt-2 mb-5">
              Đừng lo, Pé Ti tin bạn sẽ làm tốt hơn lần sau!
            </p>
            <div className="space-y-2">
              <Button
                size="lg"
                variant="warning"
                fullWidth
                onClick={() => {
                  if (refillHeart()) {
                    // continue
                  }
                }}
              >
                Hồi 1 tim (50 xu)
              </Button>
              <Button
                size="lg"
                variant="ghost"
                fullWidth
                onClick={() => router.push("/home")}
              >
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETE phase */}
      <LessonComplete
        show={phase === "complete"}
        perfect={correctCount === totalQ}
        xpEarned={xpEarned + (correctCount === totalQ ? Math.floor(lesson.xpReward * 0.2) : 0)}
        coinsEarned={coinsEarned + (correctCount === totalQ ? 5 : 0)}
        newBadges={newBadges}
        onContinue={() => {
          if (nextLesson) {
            router.push(`/lesson/${nextLesson.id}`);
          } else {
            router.push("/home");
          }
        }}
      />
      <CoinBurst show={showCoinBurst} />

      {/* Story overlay (Pé Ti kể chuyện) */}
      {story && (
        <SceneStoryPlayer
          story={story}
          open={showStory}
          onClose={() => setShowStory(false)}
        />
      )}
    </main>
  );
}
