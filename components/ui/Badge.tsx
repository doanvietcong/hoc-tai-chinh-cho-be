"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BadgeProps {
  emoji: string;
  name: string;
  description?: string;
  earned?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { box: "w-16 h-16", text: "text-[10px]" },
  md: { box: "w-20 h-20", text: "text-xs" },
  lg: { box: "w-28 h-28", text: "text-sm" },
} as const;

export function Badge({
  emoji,
  name,
  description,
  earned = true,
  size = "md",
  className,
}: BadgeProps) {
  const s = sizeMap[size];
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <motion.div
        whileHover={earned ? { scale: 1.08, rotate: -3 } : undefined}
        className={cn(
          "rounded-2xl flex items-center justify-center border-2",
          s.box,
          earned
            ? "bg-white border-brand-yellow shadow-[0_3px_0_#e6b400]"
            : "bg-surface-2 border-border opacity-50 grayscale",
        )}
        title={description}
      >
        <span className="text-3xl">{earned ? emoji : "❓"}</span>
      </motion.div>
      <p
        className={cn(
          "font-bold text-center max-w-[6rem]",
          s.text,
          earned ? "text-[color:var(--color-text)]" : "text-text-muted",
        )}
      >
        {name}
      </p>
    </div>
  );
}
