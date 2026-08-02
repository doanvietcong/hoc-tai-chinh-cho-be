"use client";

import { Heart, HeartOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeartsProps {
  hearts: number;
  maxHearts?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { icon: 16, text: "text-sm" },
  md: { icon: 22, text: "text-base" },
  lg: { icon: 28, text: "text-lg" },
} as const;

export function Hearts({ hearts, maxHearts = 5, className, size = "md" }: HeartsProps) {
  const s = sizeMap[size];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-bold text-brand-red",
        s.text,
        className,
      )}
      aria-label={`Còn ${hearts} trên ${maxHearts} tim`}
    >
      <Heart size={s.icon} fill="currentColor" strokeWidth={2.5} />
      <span>{hearts}</span>
    </div>
  );
}

export function HeartsRow({ hearts, maxHearts = 5 }: HeartsProps) {
  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`${hearts} trên ${maxHearts} tim`}>
      {Array.from({ length: maxHearts }).map((_, i) =>
        i < hearts ? (
          <Heart
            key={i}
            size={26}
            fill="#ff4b4b"
            stroke="#cc2b2b"
            strokeWidth={2.5}
          />
        ) : (
          <HeartOff key={i} size={26} className="text-[#d7d7d7]" />
        ),
      )}
    </div>
  );
}
