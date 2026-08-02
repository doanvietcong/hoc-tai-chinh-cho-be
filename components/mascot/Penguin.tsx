"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export type PenguinMood = "idle" | "happy" | "sad" | "thinking" | "celebrate" | "wave";

interface PenguinProps {
  mood?: PenguinMood;
  size?: number; // px
  className?: string;
  withShadow?: boolean;
}

/**
 * Pé Ti - chú chim cánh cụt mascot của app.
 * Pure SVG, dễ tô màu & animate bằng Framer Motion.
 */
export function Penguin({
  mood = "idle",
  size = 160,
  className,
  withShadow = true,
}: PenguinProps) {
  const wrapperVariants: Variants = {
    idle: {
      y: [0, -6, 0],
      transition: {
        duration: 2.4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    happy: {
      y: [0, -16, 0],
      rotate: [0, -3, 3, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    sad: {
      y: 0,
      rotate: 0,
      transition: { duration: 0.3 },
    },
    thinking: {
      rotate: [0, -6, 0, 6, 0],
      transition: {
        duration: 1.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    celebrate: {
      y: [0, -20, 0, -12, 0],
      rotate: [0, 360],
      transition: {
        duration: 1.1,
        repeat: Infinity,
        ease: "easeOut",
      },
    },
    wave: {
      rotate: [0, 10, -8, 10, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const mouthPath = (() => {
    if (mood === "happy" || mood === "celebrate" || mood === "wave") {
      // big smile
      return "M 70 92 Q 80 102 90 92";
    }
    if (mood === "sad") {
      return "M 70 100 Q 80 92 90 100";
    }
    if (mood === "thinking") {
      return "M 75 96 Q 80 99 85 96";
    }
    return "M 73 95 Q 80 100 87 95"; // neutral / idle
  })();

  const eyeY = mood === "thinking" ? 70 : 72;
  const eyeOpenness = mood === "happy" || mood === "celebrate" ? 0.6 : 1;

  return (
    <motion.div
      className={cn("inline-block relative", className)}
      style={{ width: size, height: size }}
      variants={wrapperVariants}
      animate={mood}
    >
      <svg
        viewBox="0 0 160 160"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="select-none"
        aria-label="Pé Ti - chim cánh cụt mascot"
      >
        {/* shadow */}
        {withShadow && (
          <ellipse
            cx="80"
            cy="148"
            rx="42"
            ry="6"
            fill="rgba(0,0,0,0.12)"
          />
        )}

        {/* body (black) */}
        <ellipse cx="80" cy="92" rx="48" ry="56" fill="#1a1a1a" />

        {/* belly (white) */}
        <ellipse cx="80" cy="100" rx="34" ry="44" fill="#ffffff" />

        {/* head highlight */}
        <ellipse cx="80" cy="52" rx="32" ry="28" fill="#1a1a1a" />

        {/* left flipper (arm) */}
        <motion.ellipse
          cx="34"
          cy="96"
          rx="10"
          ry="22"
          fill="#1a1a1a"
          animate={
            mood === "wave"
              ? { rotate: [0, -20, 20, -20, 0] }
              : { rotate: 0 }
          }
          style={{ originX: "50%", originY: "10%" }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
        {/* right flipper (arm) */}
        <motion.ellipse
          cx="126"
          cy="96"
          rx="10"
          ry="22"
          fill="#1a1a1a"
          animate={
            mood === "happy" || mood === "celebrate"
              ? { rotate: [0, -15, 15, -15, 0] }
              : { rotate: 0 }
          }
          style={{ originX: "50%", originY: "10%" }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />

        {/* feet */}
        <ellipse cx="62" cy="146" rx="14" ry="6" fill="#ff9600" />
        <ellipse cx="98" cy="146" rx="14" ry="6" fill="#ff9600" />

        {/* scarf for cute factor */}
        <path
          d="M 56 70 Q 80 78 104 70 L 104 78 Q 80 86 56 78 Z"
          fill="#ff4b4b"
        />
        <path
          d="M 100 78 L 110 100 L 100 96 L 96 92 Z"
          fill="#cc2b2b"
        />

        {/* cheeks */}
        <circle cx="56" cy="84" r="5" fill="#ff86d0" opacity="0.7" />
        <circle cx="104" cy="84" r="5" fill="#ff86d0" opacity="0.7" />

        {/* eyes */}
        <g>
          <ellipse
            cx="65"
            cy={eyeY}
            rx={4 * eyeOpenness}
            ry={6 * eyeOpenness}
            fill="#ffffff"
          />
          <ellipse
            cx="95"
            cy={eyeY}
            rx={4 * eyeOpenness}
            ry={6 * eyeOpenness}
            fill="#ffffff"
          />
          <circle cx="65" cy={eyeY + 1} r="2.4" fill="#1a1a1a" />
          <circle cx="95" cy={eyeY + 1} r="2.4" fill="#1a1a1a" />
          {/* eye shines */}
          <circle cx="66.2" cy={eyeY - 0.5} r="0.8" fill="#ffffff" />
          <circle cx="96.2" cy={eyeY - 0.5} r="0.8" fill="#ffffff" />
        </g>

        {/* beak */}
        <path
          d="M 70 88 L 90 88 L 80 100 Z"
          fill="#ff9600"
        />
        <path
          d="M 70 88 L 80 92 L 80 100 Z"
          fill="#e07a00"
        />

        {/* mouth */}
        <path
          d={mouthPath}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
