"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, CupSoda, PiggyBank, ShieldAlert } from "lucide-react";
import { useMounted } from "@/components/useMounted";
import { useProgress } from "@/lib/store";
import { ToyShopGame } from "@/components/games/ToyShopGame";
import { LemonadeGame } from "@/components/games/LemonadeGame";
import { PiggyBankGame } from "@/components/games/PiggyBankGame";
import { ScamDetectorGame } from "@/components/games/ScamDetectorGame";
import { StoryPlayer } from "@/components/mascot/StoryPlayer";
import { cn } from "@/lib/utils";

type GameId = "toy-shop" | "lemonade" | "piggy-bank" | "scam-detector";

interface GameInfo {
  id: GameId;
  title: string;
  emoji: string;
  icon: React.ReactNode;
  story: string;
  age: string;
  description: string;
}

const GAMES: GameInfo[] = [
  {
    id: "toy-shop",
    title: "Chợ đồ chơi",
    emoji: "🛍️",
    icon: <ShoppingBag size={20} />,
    age: "5-11 tuổi",
    description: "Mua sắm thông minh với 50.000đ",
    story:
      "Hôm nay Pé Ti được mẹ cho 50.000đ để mua đồ. Nhưng có quá nhiều thứ hay - từ bút chì màu đến mô hình robot. Bạn sẽ chọn mua gì để vừa TIẾT KIỆM, vừa ĐÁNG ĐỒNG TIỀN nhỉ? Nhớ: mua đồ CẦN THIẾT trước, đồ muốn mua để sau!",
  },
  {
    id: "lemonade",
    title: "Quán nước chanh",
    emoji: "🍋",
    icon: <CupSoda size={20} />,
    age: "8-11 tuổi",
    description: "Làm ông chủ 1 tuần",
    story:
      "Mùa hè đến rồi! Pé Ti mở quán nước chanh. Mỗi ngày bạn sẽ chọn GIÁ BÁN và SỐ LY PHA CHẾ. Nắng thì đông khách, mưa thì vắng. Bạn có làm ông chủ giỏi kiếm lời không? Hãy thử xem!",
  },
  {
    id: "piggy-bank",
    title: "Heo đất tuần",
    emoji: "🐷",
    icon: <PiggyBank size={20} />,
    age: "8-15 tuổi",
    description: "7 quyết định tiền trong tuần",
    story:
      "Một tuần của bạn với 7 quyết định tiền: mua kem, mua sách, nhận tiền thưởng, sinh nhật bạn thân... Mỗi ngày bạn chọn TIÊU hay TIẾT KIỆM. Cuối tuần xem heo đất bạn còn bao nhiêu!",
  },
  {
    id: "scam-detector",
    title: "Thám tử chống lừa đảo",
    emoji: "🕵️",
    icon: <ShieldAlert size={20} />,
    age: "9-15 tuổi",
    description: "Phân biệt quảng cáo thật vs lừa đảo",
    story:
      "Pé Ti nhận được nhiều tin nhắn và quảng cáo mỗi ngày. Làm sao biết cái nào THẬT, cái nào LỪA ĐẢO? Hãy đọc kỹ và quyết định - mỗi câu trả lời đúng là một bài học quý giá!",
  },
];

export default function PlayPage() {
  const router = useRouter();
  const mounted = useMounted();
  const user = useProgress((s) => s.user);
  const [activeGame, setActiveGame] = useState<GameId>("toy-shop");

  if (!mounted || !user) return null;

  const currentGame = GAMES.find((g) => g.id === activeGame)!;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f0e0ff] via-white to-[#d6f0fb]">
      <header className="sticky top-0 z-20 bg-white border-b-2 border-[color:var(--color-border)]">
        <div className="mx-auto max-w-2xl px-3 sm:px-5 h-14 flex items-center justify-between">
          <Link
            href="/home"
            className="flex items-center gap-1.5 text-sm font-semibold text-text-muted"
          >
            <ArrowLeft size={20} /> Trang chủ
          </Link>
          <h1 className="font-extrabold text-brand-purple">🎮 Mini-games</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        {/* Game tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id)}
              className={cn(
                "rounded-2xl border-2 p-3 text-center transition-all",
                activeGame === g.id
                  ? "border-brand-purple bg-[#f0e0ff] shadow-[0_3px_0_#a55fe0]"
                  : "border-[color:var(--color-border-strong)] bg-white hover:bg-surface",
              )}
            >
              <div className="text-2xl mb-1">{g.emoji}</div>
              <p
                className={cn(
                  "text-xs font-bold leading-tight",
                  activeGame === g.id ? "text-brand-purple" : "text-text-muted",
                )}
              >
                {g.title}
              </p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Story intro */}
            <StoryPlayer
              title={`📖 ${currentGame.title} - Pé Ti kể`}
              text={currentGame.story}
            />

            {/* Game description */}
            <div className="text-center text-sm text-text-muted">
              👥 {currentGame.age} · {currentGame.description}
            </div>

            {/* Game */}
            {activeGame === "toy-shop" && <ToyShopGame budget={50000} />}
            {activeGame === "lemonade" && (
              <LemonadeGame startCapital={50000} pricePerGlass={12000} days={7} />
            )}
            {activeGame === "piggy-bank" && <PiggyBankGame startSavings={20000} />}
            {activeGame === "scam-detector" && <ScamDetectorGame />}
          </motion.div>
        </AnimatePresence>

        <div className="text-center text-xs text-text-soft italic">
          💡 Tip: Mini-games giúp bé thực hành bài học qua tình huống thực tế.
        </div>
      </div>
    </main>
  );
}
