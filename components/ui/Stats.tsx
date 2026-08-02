"use client";

import { Flame, Coins, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakBadge({
  days,
  className,
}: {
  days: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-bold text-brand-orange",
        className,
      )}
      aria-label={`Streak ${days} ngày`}
    >
      <Flame size={22} fill="currentColor" strokeWidth={2.5} />
      <span className="text-base">{days}</span>
    </div>
  );
}

export function CoinDisplay({
  coins,
  className,
}: {
  coins: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-bold text-brand-yellow-dark",
        className,
      )}
      aria-label={`${coins} xu`}
    >
      <Coins size={22} className="text-brand-yellow" fill="currentColor" />
      <span className="text-base">{coins}</span>
    </div>
  );
}

export function XPDisplay({
  xp,
  className,
}: {
  xp: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-bold text-brand-blue",
        className,
      )}
      aria-label={`${xp} XP`}
    >
      <Star size={22} fill="currentColor" />
      <span className="text-base">{xp} XP</span>
    </div>
  );
}
