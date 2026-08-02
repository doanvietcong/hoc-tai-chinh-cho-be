"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0..1
  className?: string;
  /** Optional label shown on top. */
  label?: string;
  /** Color theme. */
  tone?: "green" | "blue" | "yellow" | "red";
}

const toneMap = {
  green: "bg-brand-green",
  blue: "bg-brand-blue",
  yellow: "bg-brand-yellow",
  red: "bg-brand-red",
} as const;

export function ProgressBar({
  value,
  className,
  label,
  tone = "green",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between text-xs font-semibold text-text-muted mb-1">
          <span>{label}</span>
          <span>{Math.round(clamped * 100)}%</span>
        </div>
      )}
      <div
        className="w-full h-4 bg-[color:var(--color-surface-2)] rounded-full overflow-hidden border-2 border-[color:var(--color-border)]"
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={cn("h-full rounded-full", toneMap[tone])}
          initial={{ width: 0 }}
          animate={{ width: `${clamped * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </div>
    </div>
  );
}
