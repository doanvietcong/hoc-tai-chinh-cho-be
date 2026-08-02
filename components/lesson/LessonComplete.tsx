"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Penguin } from "@/components/mascot/Penguin";
import { Star, Coins, Flame, Trophy } from "lucide-react";

interface Props {
  show: boolean;
  perfect: boolean;
  xpEarned: number;
  coinsEarned: number;
  newBadges?: { emoji: string; name: string }[];
  onContinue: () => void;
}

export function LessonComplete({
  show,
  perfect,
  xpEarned,
  coinsEarned,
  newBadges = [],
  onContinue,
}: Props) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (show) {
      setPhase(0);
      const t1 = setTimeout(() => setPhase(1), 600);
      const t2 = setTimeout(() => setPhase(2), 1200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl border-4 border-brand-yellow max-w-md w-full p-6 sm:p-8 text-center shadow-2xl"
            initial={{ scale: 0.5, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <div className="flex justify-center mb-2">
              <Penguin mood="celebrate" size={120} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark mb-1">
              Hoàn thành bài học!
            </h2>
            <p className="text-text-muted mb-5">
              {perfect
                ? "Pé Ti cực kỳ tự hào về bạn! 🐧✨"
                : "Tốt lắm! Lần sau cố gắng thêm nhé!"}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: phase >= 1 ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="rounded-2xl bg-[#e8f8d8] p-4"
              >
                <Star className="mx-auto text-brand-green" size={28} fill="currentColor" />
                <p className="text-2xl font-extrabold text-brand-green-dark mt-1">
                  +{xpEarned}
                </p>
                <p className="text-xs text-text-muted">XP</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: phase >= 1 ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="rounded-2xl bg-[#fff4cc] p-4"
              >
                <Coins className="mx-auto text-brand-yellow-dark" size={28} fill="currentColor" />
                <p className="text-2xl font-extrabold text-brand-yellow-dark mt-1">
                  +{coinsEarned}
                </p>
                <p className="text-xs text-text-muted">Xu</p>
              </motion.div>
            </div>

            {newBadges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
                className="mb-5 rounded-2xl bg-[#f0e0ff] p-4"
              >
                <p className="text-sm font-bold text-brand-purple flex items-center justify-center gap-1.5 mb-2">
                  <Trophy size={16} /> Huy hiệu mới!
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {newBadges.map((b, i) => (
                    <div key={i} className="text-center">
                      <div className="text-3xl anim-pop">{b.emoji}</div>
                      <p className="text-xs font-semibold mt-0.5">
                        {b.name}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <Button size="lg" variant="primary" fullWidth onClick={onContinue}>
              Tiếp tục
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Floating coin effect for celebration */
export function CoinBurst({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dx = Math.cos(angle) * 80;
        return (
          <span
            key={i}
            className="text-3xl anim-coin-burst"
            style={{
              transform: `translate(${dx}px, 0)`,
              animationDelay: `${i * 0.05}s`,
            }}
          >
            🪙
          </span>
        );
      })}
    </div>
  );
}

export function StreakBanner({ streak }: { streak: number }) {
  if (streak <= 0) return null;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4cc] border-2 border-brand-yellow px-3 py-1 text-sm font-bold text-brand-yellow-dark">
      <Flame size={16} fill="currentColor" /> {streak} ngày liên tục!
    </div>
  );
}
