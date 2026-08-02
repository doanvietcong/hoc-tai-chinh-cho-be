"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn, formatVNNumber } from "@/lib/utils";

interface DayEvent {
  day: number;
  emoji: string;
  title: string;
  /** Số tiền nhận được (lương, tiêu vặt, thưởng) - dương = nhận, âm = mất */
  income: number;
  /** Sự lựa chọn chi tiêu */
  choices: { id: string; label: string; emoji: string; cost: number; good: boolean }[];
}

const EVENTS: DayEvent[] = [
  {
    day: 1,
    emoji: "📅",
    title: "Thứ Hai - Đầu tuần",
    income: 20000, // tiền tiêu vặt tuần
    choices: [
      { id: "d1-save", label: "Bỏ hết vào heo đất", emoji: "🐖", cost: 20000, good: true },
      { id: "d1-spend", label: "Mua bim bim liên hoan", emoji: "🍿", cost: 20000, good: false },
      { id: "d1-split", label: "Chia 3 hũ (tiết kiệm/tiêu/cho)", emoji: "🥉", cost: 20000, good: true },
    ],
  },
  {
    day: 2,
    emoji: "🍦",
    title: "Thứ Ba - Nóng quá!",
    income: 0,
    choices: [
      { id: "d2-ice", label: "Mua kem 15k cho mát", emoji: "🍦", cost: 15000, good: false },
      { id: "d2-water", label: "Uống nước lọc (miễn phí)", emoji: "💧", cost: 0, good: true },
      { id: "d2-share", label: "Mua 2 cây, chia bạn 1 cây", emoji: "🤝", cost: 30000, good: false },
    ],
  },
  {
    day: 3,
    emoji: "📚",
    title: "Thứ Tư - Có bài tốt!",
    income: 0,
    choices: [
      { id: "d3-book", label: "Mua sách mới 25k để đọc thêm", emoji: "📖", cost: 25000, good: true },
      { id: "d3-game", label: "Mua game mới 50k", emoji: "🎮", cost: 50000, good: false },
      { id: "d3-save", label: "Bỏ vào heo đất", emoji: "🐷", cost: 0, good: true },
    ],
  },
  {
    day: 4,
    emoji: "🎂",
    title: "Thứ Năm - Sinh nhật bạn thân!",
    income: 50000, // mừng tuổi nhận được
    choices: [
      { id: "d4-save", label: "Bỏ hết vào heo đất", emoji: "🐖", cost: 0, good: true },
      { id: "d4-gift", label: "Mua quà sinh nhật 30k", emoji: "🎁", cost: 30000, good: true },
      { id: "d4-spend", label: "Tiêu hết mua đồ cho mình", emoji: "🛍️", cost: 0, good: false },
    ],
  },
  {
    day: 5,
    emoji: "🎨",
    title: "Thứ Sáu - Dự án nghệ thuật",
    income: 0,
    choices: [
      { id: "d5-art", label: "Mua bút màu 20k cho dự án", emoji: "🖍️", cost: 20000, good: true },
      { id: "d5-cheap", label: "Mượn bút của bạn (free)", emoji: "🤝", cost: 0, good: true },
      { id: "d5-toy", label: "Mua đồ chơi mới 40k", emoji: "🧸", cost: 40000, good: false },
    ],
  },
  {
    day: 6,
    emoji: "🏆",
    title: "Thứ Bảy - Được thưởng!",
    income: 30000, // thưởng vì học giỏi
    choices: [
      { id: "d6-save", label: "Bỏ hết vào heo đất", emoji: "🐖", cost: 0, good: true },
      { id: "d6-split", label: "Chia 3 hũ", emoji: "🥉", cost: 0, good: true },
      { id: "d6-celebrate", label: "Tiêu hết đi ăn kem + xem phim", emoji: "🎉", cost: 30000, good: false },
    ],
  },
  {
    day: 7,
    emoji: "🌅",
    title: "Chủ Nhật - Cuối tuần",
    income: 0,
    choices: [
      { id: "d7-save", label: "Bỏ vào heo đất để dành", emoji: "🐖", cost: 0, good: true },
      { id: "d7-charity", label: "Cho đi 10k giúp đỡ người khó khăn", emoji: "❤️", cost: 10000, good: true },
      { id: "d7-toy", label: "Mua đồ chơi mới 20k", emoji: "🧸", cost: 20000, good: false },
    ],
  },
];

interface Props {
  startSavings?: number;
  onComplete?: (finalSavings: number, score: number) => void;
}

interface Choice {
  day: number;
  choiceId: string;
  label: string;
  cost: number;
  good: boolean;
  earned: number;
}

export function PiggyBankGame({ startSavings = 20000, onComplete }: Props) {
  const [day, setDay] = useState(0);
  const [savings, setSavings] = useState(startSavings);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [done, setDone] = useState(false);

  const totalEarned = EVENTS.reduce((s, e) => s + e.income, 0);
  const totalSpent = choices.reduce((s, c) => s + c.cost, 0);
  const goodCount = choices.filter((c) => c.good).length;
  const finalSavings = startSavings + totalEarned - totalSpent;
  const score = goodCount * 10 - (EVENTS.length - goodCount) * 5;

  function makeChoice(choiceId: string, label: string, cost: number, good: boolean) {
    if (done) return;
    const event = EVENTS[day];
    const newChoice: Choice = {
      day: day + 1,
      choiceId,
      label,
      cost,
      good,
      earned: event.income,
    };
    setChoices((c) => [...c, newChoice]);
    setSavings((s) => s + event.income - cost);
    if (day + 1 >= EVENTS.length) {
      setDone(true);
      onComplete?.(finalSavings + event.income - cost, score + (good ? 10 : -5));
    } else {
      setDay((d) => d + 1);
    }
  }

  function reset() {
    setDay(0);
    setSavings(startSavings);
    setChoices([]);
    setDone(false);
  }

  if (done) {
    const rating =
      finalSavings > 60000
        ? {
            emoji: "🏆",
            label: "Bậc thầy tiết kiệm!",
            color: "text-brand-yellow-dark",
          }
        : finalSavings > 30000
          ? { emoji: "😊", label: "Làm tốt lắm!", color: "text-brand-green" }
          : { emoji: "💪", label: "Cần cố gắng thêm!", color: "text-brand-orange" };

    return (
      <div className="bg-white rounded-3xl border-2 border-[color:var(--color-border-strong)] p-6 text-center space-y-4">
        <div className="text-6xl">{rating.emoji}</div>
        <h3 className={`text-2xl font-extrabold ${rating.color}`}>{rating.label}</h3>
        <p className="text-text-muted">Bạn quyết định 7 ngày xong!</p>
        <div className="bg-surface p-4 rounded-2xl text-sm space-y-2">
          <div className="flex justify-between text-base">
            <span>💰 Vốn ban đầu:</span>
            <b>{formatVNNumber(startSavings)}đ</b>
          </div>
          <div className="flex justify-between">
            <span>📥 Tổng thu nhập:</span>
            <b className="text-brand-green">+{formatVNNumber(totalEarned)}đ</b>
          </div>
          <div className="flex justify-between">
            <span>📤 Tổng chi tiêu:</span>
            <b className="text-brand-red">-{formatVNNumber(totalSpent)}đ</b>
          </div>
          <div className="border-t-2 border-[color:var(--color-border)] pt-2 flex justify-between text-lg">
            <span>🐷 Heo đất cuối tuần:</span>
            <b className="text-brand-green-dark">{formatVNNumber(finalSavings)}đ</b>
          </div>
        </div>
        <div className="text-left bg-surface p-3 rounded-2xl text-sm max-h-40 overflow-y-auto">
          <p className="font-bold mb-2">📊 Lịch sử quyết định:</p>
          {choices.map((c) => (
            <div
              key={c.day}
              className={cn(
                "flex justify-between py-1 border-b border-[color:var(--color-border)]",
              )}
            >
              <span>
                Ngày {c.day}: {c.label}
              </span>
              <span className={c.good ? "text-brand-green" : "text-brand-red"}>
                {c.cost === 0 ? "✓ Miễn phí" : `-${formatVNNumber(c.cost)}đ`}
              </span>
            </div>
          ))}
        </div>
        <Button size="lg" variant="primary" onClick={reset} fullWidth>
          Chơi lại
        </Button>
      </div>
    );
  }

  const event = EVENTS[day];

  return (
    <div className="space-y-4">
      <div className="bg-[#fff4cc] rounded-2xl border-2 border-brand-yellow p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-muted">Heo đất hiện tại</p>
          <p className="text-2xl font-extrabold text-brand-yellow-dark">
            🐖 {formatVNNumber(savings)}đ
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-muted">Ngày</p>
          <p className="text-2xl font-extrabold text-brand-blue">
            {day + 1} / {EVENTS.length}
          </p>
        </div>
      </div>

      <motion.div
        key={day}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border-2 border-[color:var(--color-border-strong)] p-5"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl">{event.emoji}</div>
          <div>
            <h3 className="text-lg font-extrabold">{event.title}</h3>
            {event.income > 0 && (
              <p className="text-sm font-bold text-brand-green">
                + {formatVNNumber(event.income)}đ (tiền nhận được hôm nay)
              </p>
            )}
          </div>
        </div>
        <p className="text-sm text-text-muted italic">
          Bạn sẽ làm gì? Chọn 1 phương án:
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {event.choices.map((choice) => (
          <motion.button
            key={choice.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => makeChoice(choice.id, choice.label, choice.cost, choice.good)}
            className="rounded-2xl border-2 border-[color:var(--color-border-strong)] bg-white p-4 text-left hover:bg-[#f3f3f3] transition-colors"
          >
            <div className="text-3xl text-center mb-2">{choice.emoji}</div>
            <p className="text-sm font-bold text-center leading-tight">
              {choice.label}
            </p>
            <p
              className={cn(
                "text-center text-xs font-bold mt-2",
                choice.cost === 0
                  ? "text-brand-green"
                  : "text-brand-yellow-dark",
              )}
            >
              {choice.cost === 0
                ? "Miễn phí"
                : `-${formatVNNumber(choice.cost)}đ`}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
