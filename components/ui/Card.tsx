"use client";

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  tone?: "default" | "green" | "blue" | "yellow" | "red" | "purple";
}

const toneMap = {
  default: "bg-white",
  green: "bg-[#e8f8d8]",
  blue: "bg-[#d6f0fb]",
  yellow: "bg-[#fff4cc]",
  red: "bg-[#ffe1e1]",
  purple: "bg-[#f0e0ff]",
} as const;

export function Card({
  interactive,
  tone = "default",
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border-2 border-[color:var(--color-border)] p-5",
        toneMap[tone],
        interactive &&
          "cursor-pointer transition-transform hover:-translate-y-1 active:translate-y-0 hover:shadow-[0_4px_0_var(--color-border-strong)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
