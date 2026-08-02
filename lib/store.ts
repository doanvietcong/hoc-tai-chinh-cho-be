"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { dayDiff, todayKey } from "./utils";
import { BADGES, getLesson } from "./lessons";
import type {
  ProgressState,
  QuestionResult,
  UserProfile,
} from "./types";

interface Actions {
  /** Set initial profile (called from onboarding). */
  setUser: (user: UserProfile) => void;
  /** Logout/reset profile. */
  resetUser: () => void;

  /** Start a lesson - bumps the day streak if needed. */
  startLesson: (lessonId: string) => void;

  /** Record answer result. Updates hearts, xp, coins, total stats. */
  recordAnswer: (
    lessonId: string,
    result: QuestionResult,
  ) => void;

  /** Mark lesson as completed. Updates streak. */
  completeLesson: (lessonId: string, perfect: boolean) => void;

  /** Restore a heart manually (1 heart, costs 50 coins). */
  refillHeart: () => boolean;

  /** Wipe everything - useful for tests / dev tools. */
  resetAll: () => void;
}

const initialState: ProgressState = {
  user: null,
  xp: 0,
  coins: 0,
  hearts: 5,
  maxHearts: 5,
  streak: 0,
  lastLessonDate: null,
  completedLessons: [],
  lessonResults: {},
  badges: [],
  totalCorrect: 0,
  totalAnswered: 0,
};

export const useProgress = create<ProgressState & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      resetUser: () => set({ ...initialState, user: null }),

      startLesson: (_lessonId) => {
        const today = todayKey();
        const { lastLessonDate, streak } = get();
        let newStreak = streak;
        if (lastLessonDate !== today) {
          if (lastLessonDate == null) {
            newStreak = 1;
          } else {
            const diff = dayDiff(today, lastLessonDate);
            if (diff === 1) {
              newStreak = streak + 1;
            } else if (diff > 1) {
              newStreak = 1;
            } else {
              newStreak = Math.max(1, streak);
            }
          }
        }
        set({ streak: newStreak, lastLessonDate: today });
      },

      recordAnswer: (lessonId, result) => {
        const state = get();
        const newHearts = result.correct
          ? state.hearts
          : Math.max(0, state.hearts - 1);
        const prevResults = state.lessonResults[lessonId] ?? [];
        // Replace existing result for this question
        const updatedLessonResults = prevResults.filter(
          (r) => r.questionId !== result.questionId,
        );
        updatedLessonResults.push(result);

        set({
          hearts: newHearts,
          xp: state.xp + result.xpEarned,
          coins: state.coins + result.coinsEarned,
          totalCorrect: state.totalCorrect + (result.correct ? 1 : 0),
          totalAnswered: state.totalAnswered + 1,
          lessonResults: {
            ...state.lessonResults,
            [lessonId]: updatedLessonResults,
          },
        });
      },

      completeLesson: (lessonId, perfect) => {
        const state = get();
        if (state.completedLessons.includes(lessonId)) {
          // already done - still check badges
          checkBadges(set, get);
          return;
        }
        const lesson = getLesson(lessonId);
        if (!lesson) return;

        const bonusXp = perfect ? Math.floor(lesson.xpReward * 0.2) : 0;
        const newState = {
          ...state,
          completedLessons: [...state.completedLessons, lessonId],
          xp: state.xp + bonusXp,
          coins: state.coins + (perfect ? 5 : 0),
        };
        set(newState);
        checkBadges(set, get);
      },

      refillHeart: () => {
        const state = get();
        if (state.hearts >= state.maxHearts) return false;
        if (state.coins < 50) return false;
        set({
          hearts: state.hearts + 1,
          coins: state.coins - 50,
        });
        return true;
      },

      resetAll: () => set({ ...initialState }),
    }),
    {
      name: "pe-ti-progress",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

/** Evaluate badge conditions and add newly-earned badges. */
function checkBadges(
  set: (
    partial:
      | Partial<ProgressState>
      | ((state: ProgressState) => Partial<ProgressState>),
  ) => void,
  get: () => ProgressState,
) {
  const state = get();
  const newlyEarned: string[] = [];
  for (const b of BADGES) {
    if (!state.badges.includes(b.id) && b.condition(state)) {
      newlyEarned.push(b.id);
    }
  }
  if (newlyEarned.length > 0) {
    set({ badges: [...state.badges, ...newlyEarned] });
  }
}
