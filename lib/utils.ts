import { clsx, type ClassValue } from "clsx";
import type { AgeGroup } from "./types";

/** Combine className with clsx. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Map raw age (5-15) into a coarse age group used for content targeting. */
export function ageToGroup(age: number): AgeGroup {
  if (age <= 7) return "5-7";
  if (age <= 11) return "8-11";
  return "12-15";
}

/** Today's date as YYYY-MM-DD using local time. */
export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Day difference (positive if `a` is after `b`). */
export function dayDiff(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((da - db) / 86_400_000);
}

/** Pick a random celebratory phrase after a correct answer. */
const PHRASES_CORRECT = [
  "Tuyệt vời! 🎉",
  "Giỏi quá! 🌟",
  "Chính xác! 💪",
  "Pé Ti tự hào về bạn! 🐧",
  "Đỉnh lắm! 🚀",
  "Bạn là thiên tài tài chính! 🧠",
];
const PHRASES_WRONG = [
  "Chưa đúng rồi, thử lại nhé! 💡",
  "Gần đúng rồi, bạn ơi! 🤔",
  "Đừng lo, mình cùng suy nghĩ lại nhé! ✨",
];

export function randomCorrect() {
  return PHRASES_CORRECT[Math.floor(Math.random() * PHRASES_CORRECT.length)];
}
export function randomWrong() {
  return PHRASES_WRONG[Math.floor(Math.random() * PHRASES_WRONG.length)];
}

/** Shuffle array non-mutatively. */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Vietnamese number formatter: 10000 -> "10.000". */
export function formatVNNumber(n: number): string {
  return n.toLocaleString("vi-VN");
}
