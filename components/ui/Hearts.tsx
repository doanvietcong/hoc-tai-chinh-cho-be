"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Clock } from "lucide-react";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Format milliseconds as "mm:ss" or "Xm Ys". */
function formatMs(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface HeartsProps {
  className?: string;
  /** Compact mode (no label) for headers. */
  compact?: boolean;
}

export function Hearts({ className, compact = true }: HeartsProps) {
  const hearts = useProgress((s) => s.hearts);
  const maxHearts = useProgress((s) => s.maxHearts);
  const lastChangeAt = useProgress((s) => s.heartsLastChangeAt);
  const intervalMs = useProgress((s) => s.heartRegenIntervalMs);
  const regenHeart = useProgress((s) => s.regenHeart);
  const soundEnabled = useProgress((s) => s.soundEnabled);
  const [now, setNow] = useState(() => Date.now());

  // Tick every 5s (cheap, only updates display)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  // Try to regen every 30s + whenever hearts change
  useEffect(() => {
    if (hearts >= maxHearts) return;
    const tryRegen = () => {
      const added = regenHeart();
      if (added && soundEnabled) {
        // soft ding - we use sfx indirectly via the regen event
        try {
          // import dynamically to avoid SSR issues
          import("@/lib/sounds").then(({ sfx }) => sfx.heart());
        } catch {
          /* ignore */
        }
      }
    };
    const t = setInterval(tryRegen, 30_000);
    // Also try immediately (e.g. after page load with elapsed time)
    tryRegen();
    return () => clearInterval(t);
  }, [hearts, maxHearts, regenHeart, soundEnabled]);

  const remaining = lastChangeAt
    ? Math.max(0, intervalMs - (now - lastChangeAt))
    : 0;

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 bg-white border-2 border-[color:var(--color-border)] rounded-full px-2.5 h-9",
          className,
        )}
      >
        <Heart size={16} className="text-brand-red fill-brand-red" />
        <span className="text-sm font-extrabold">{hearts}</span>
        {hearts < maxHearts && remaining > 0 && (
          <span
            className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold text-text-muted ml-0.5"
            title="Tim tự hồi"
          >
            <Clock size={10} />
            {formatMs(remaining)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-1">
        {Array.from({ length: maxHearts }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              scale: i < hearts ? 1 : 0.85,
              opacity: i < hearts ? 1 : 0.35,
            }}
          >
            <Heart
              size={28}
              className={
                i < hearts
                  ? "text-brand-red fill-brand-red"
                  : "text-text-muted"
              }
            />
          </motion.div>
        ))}
      </div>
      {hearts < maxHearts && remaining > 0 && (
        <p className="text-xs text-text-muted flex items-center gap-1">
          <Clock size={12} />
          Tim kế tiếp: <b>{formatMs(remaining)}</b>
        </p>
      )}
    </div>
  );
}

export function HeartsRow({
  hearts,
  maxHearts = 5,
}: {
  hearts: number;
  maxHearts?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxHearts }).map((_, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={{ scale: i < hearts ? 1 : 0.85, opacity: i < hearts ? 1 : 0.35 }}
          className="text-xl"
        >
          {i < hearts ? "❤️" : "🩶"}
        </motion.span>
      ))}
    </div>
  );
}
