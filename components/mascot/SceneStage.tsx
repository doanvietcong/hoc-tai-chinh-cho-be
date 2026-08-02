"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Scene, SceneProp } from "@/lib/types";
import { Penguin } from "./Penguin";
import { cn } from "@/lib/utils";

interface Props {
  scene: Scene;
  className?: string;
}

/**
 * "Sân khấu" của Pé Ti: mascot ở giữa + các props chuyển động xung quanh.
 * Pure SVG + framer-motion, không cần Lottie files.
 */
export function SceneStage({ scene, className }: Props) {
  return (
    <div
      className={cn(
        "relative w-full aspect-[16/9] sm:aspect-[16/8] rounded-3xl overflow-hidden border-2 border-[color:var(--color-border-strong)]",
        "bg-gradient-to-b from-[#e8f4ff] via-[#fff8e1] to-[#f0e8ff]",
        className,
      )}
    >
      {/* Soft background pattern */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4) 0%, transparent 50%)",
        }}
      />

      {/* AnimatePresence for scene changes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.text.slice(0, 16)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
        >
          <SceneContent scene={scene} />
        </motion.div>
      </AnimatePresence>

      {/* Penguin in the middle, slightly raised */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-1 z-20">
        <Penguin mood={scene.mood} size={110} />
      </div>

      {/* Caption text */}
      <div className="absolute left-2 right-2 top-2 z-20">
        <motion.div
          key={scene.text.slice(0, 16) + "-caption"}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white/95 backdrop-blur rounded-2xl px-3 py-2 shadow-sm border border-[color:var(--color-border)]"
        >
          <p className="text-xs sm:text-sm text-[color:var(--color-text)] leading-relaxed text-center font-medium">
            🐧 {scene.text}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function SceneContent({ scene }: { scene: Scene }) {
  const { visual } = scene;
  if (visual.kind === "props") {
    return (
      <div className="absolute inset-0 flex items-end justify-around pb-16 px-4">
        {visual.items.map((item, idx) => (
          <PropRenderer key={idx} prop={item} delay={idx * 0.15} />
        ))}
      </div>
    );
  }
  if (visual.kind === "split") {
    return (
      <div className="absolute inset-0 grid grid-cols-2 gap-2 p-3 pb-16">
        <div className="bg-white/50 rounded-2xl p-2 flex flex-col items-center justify-end gap-1.5">
          <div className="flex flex-col items-center gap-1 flex-1 justify-end">
            {visual.left.map((p, i) => (
              <PropRenderer key={i} prop={p} delay={i * 0.12} />
            ))}
          </div>
          {visual.leftLabel && (
            <span className="bg-white border-2 border-brand-green text-brand-green-dark text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
              {visual.leftLabel}
            </span>
          )}
        </div>
        <div className="bg-white/50 rounded-2xl p-2 flex flex-col items-center justify-end gap-1.5">
          <div className="flex flex-col items-center gap-1 flex-1 justify-end">
            {visual.right.map((p, i) => (
              <PropRenderer key={i} prop={p} delay={i * 0.12} />
            ))}
          </div>
          {visual.rightLabel && (
            <span className="bg-white border-2 border-brand-red text-brand-red text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
              {visual.rightLabel}
            </span>
          )}
        </div>
      </div>
    );
  }
  if (visual.kind === "spotlight") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pb-12">
        <PropRenderer prop={visual.prop} large />
      </div>
    );
  }
  return null;
}

function PropRenderer({
  prop,
  delay = 0,
  large = false,
}: {
  prop: SceneProp;
  delay?: number;
  large?: boolean;
}) {
  switch (prop.type) {
    case "coin":
      return <CoinProp {...prop} delay={delay} large={large} />;
    case "jar":
      return <JarProp {...prop} delay={delay} />;
    case "piggy":
      return <PiggyProp {...prop} delay={delay} large={large} />;
    case "bill":
      return <BillProp {...prop} delay={delay} />;
    case "chart-pie":
      return <PieChartProp {...prop} delay={delay} />;
    case "shield":
      return <ShieldProp {...prop} delay={delay} large={large} />;
    case "tree":
      return <TreeProp {...prop} delay={delay} large={large} />;
    case "bank":
      return <BankProp {...prop} delay={delay} />;
    case "emoji":
      return (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay, type: "spring", stiffness: 200 }}
          className="select-none"
          style={{
            fontSize: prop.size
              ? `${prop.size}px`
              : large
                ? "80px"
                : "48px",
            lineHeight: 1,
          }}
        >
          {prop.emoji}
        </motion.div>
      );
    case "sparkle":
      return <SparkleProp delay={delay} />;
  }
}

/* ============= Individual props ============= */

function CoinProp({
  amount,
  tone = "gold",
  delay = 0,
  large = false,
}: Extract<SceneProp, { type: "coin" }> & { delay?: number; large?: boolean }) {
  const size = large ? 90 : 56;
  const fill = tone === "gold" ? "#ffc83d" : "#cbd5e1";
  const ring = tone === "gold" ? "#d97706" : "#94a3b8";
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, y: 20 }}
      animate={{
        scale: 1,
        rotate: 0,
        y: [0, -6, 0],
        transition: {
          scale: { delay, type: "spring", stiffness: 180 },
          rotate: { delay, duration: 0.6 },
          y: {
            delay: delay + 0.3,
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
      }}
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="44" fill={ring} />
        <circle cx="50" cy="50" r="38" fill={fill} stroke="#fff8dc" strokeWidth="2" />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontSize="36"
          fontWeight="900"
          fill={tone === "gold" ? "#7c2d12" : "#475569"}
          fontFamily="serif"
        >
          đ
        </text>
      </svg>
      {amount != null && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-[color:var(--color-border)] rounded-full px-1.5 text-[9px] font-bold text-text-muted">
          {amount.toLocaleString("vi-VN")}đ
        </div>
      )}
    </motion.div>
  );
}

function JarProp({
  label,
  tone,
  fillPct,
  delay = 0,
}: Extract<SceneProp, { type: "jar" }> & { delay?: number }) {
  const colors = {
    save: { body: "#86efac", accent: "#16a34a" },
    spend: { body: "#fcd34d", accent: "#d97706" },
    give: { body: "#f9a8d4", accent: "#db2777" },
    neutral: { body: "#e5e7eb", accent: "#6b7280" },
  }[tone];
  const clamped = Math.max(0, Math.min(100, fillPct));
  const heightPx = 110;
  const fillHeight = (clamped / 100) * (heightPx - 16);
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 160 }}
      className="flex flex-col items-center gap-1"
    >
      <div className="relative" style={{ width: 64, height: heightPx + 14 }}>
        {/* Lid */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-t-md"
          style={{
            width: 56,
            height: 14,
            background: colors.accent,
          }}
        />
        {/* Body */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-2xl overflow-hidden border-2"
          style={{
            width: 64,
            height: heightPx,
            background: "#fff",
            borderColor: colors.accent,
          }}
        >
          {/* Fill */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: fillHeight }}
            transition={{
              delay: delay + 0.3,
              duration: 0.9,
              ease: "easeOut",
            }}
            className="absolute bottom-0 left-0 right-0"
            style={{ background: colors.body }}
          />
          {/* Label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white/85"
              style={{ color: colors.accent }}
            >
              {label}
            </span>
          </div>
        </div>
      </div>
      <p className="text-[10px] font-bold text-text-muted">{clamped}%</p>
    </motion.div>
  );
}

function PiggyProp({
  coins = 0,
  mood = "neutral",
  delay = 0,
  large = false,
}: Extract<SceneProp, { type: "piggy" }> & { delay?: number; large?: boolean }) {
  const size = large ? 140 : 96;
  const smile = mood === "happy" || mood === "rich";
  return (
    <motion.div
      initial={{ scale: 0, y: 20 }}
      animate={{
        scale: 1,
        y: [0, -4, 0],
        transition: {
          scale: { delay, type: "spring", stiffness: 160 },
          y: {
            delay: delay + 0.4,
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
      }}
      className="relative"
      style={{ width: size, height: size * 0.8 }}
    >
      <svg viewBox="0 0 200 160" width={size} height={size * 0.8}>
        {/* Body */}
        <ellipse cx="100" cy="90" rx="80" ry="55" fill="#f9a8d4" />
        {/* Snout */}
        <ellipse cx="160" cy="90" rx="22" ry="20" fill="#f472b6" />
        <circle cx="155" cy="86" r="2.5" fill="#831843" />
        <circle cx="165" cy="86" r="2.5" fill="#831843" />
        <circle cx="160" cy="96" r="2" fill="#831843" />
        {/* Coin slot */}
        <rect x="90" y="50" width="30" height="5" rx="2" fill="#831843" />
        {/* Eye */}
        <circle cx="135" cy="70" r="3" fill="#1a1a1a" />
        <circle cx="135.5" cy="69" r="0.8" fill="#fff" />
        {/* Ear */}
        <path d="M 120 50 L 130 35 L 138 48 Z" fill="#f472b6" />
        {/* Legs */}
        <rect x="55" y="135" width="18" height="20" rx="6" fill="#f472b6" />
        <rect x="125" y="135" width="18" height="20" rx="6" fill="#f472b6" />
        {/* Tail */}
        <path
          d="M 22 90 Q 12 75 22 65 Q 32 75 22 90"
          fill="none"
          stroke="#f472b6"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Smile */}
        {smile ? (
          <path
            d="M 145 105 Q 152 112 159 105"
            stroke="#831843"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <line
            x1="148"
            y1="108"
            x2="160"
            y2="108"
            stroke="#831843"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {/* Cheek */}
        <circle cx="105" cy="92" r="6" fill="#fda4af" opacity="0.6" />
      </svg>
      {coins > 0 && (
        <div className="absolute -top-2 -right-2 bg-brand-yellow text-[#3c3c3c] text-[10px] font-extrabold rounded-full px-1.5 py-0.5 border border-white shadow-sm">
          +{coins}
        </div>
      )}
    </motion.div>
  );
}

function BillProp({
  value,
  tone = "good",
  delay = 0,
}: Extract<SceneProp, { type: "bill" }> & { delay?: number }) {
  const colors = tone === "good"
    ? { bg: "#dcfce7", accent: "#16a34a" }
    : { bg: "#fee2e2", accent: "#dc2626" };
  return (
    <motion.div
      initial={{ rotate: -20, scale: 0, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="rounded-lg border-2 shadow-sm"
      style={{
        background: colors.bg,
        borderColor: colors.accent,
        width: 100,
        height: 56,
      }}
    >
      <div
        className="h-full w-full flex flex-col items-center justify-center"
        style={{ color: colors.accent }}
      >
        <p className="text-[9px] font-bold opacity-80">TỜ TIỀN</p>
        <p className="text-base font-extrabold">{value.toLocaleString("vi-VN")}đ</p>
      </div>
    </motion.div>
  );
}

function PieChartProp({
  segments,
  delay = 0,
}: Extract<SceneProp, { type: "chart-pie" }> & { delay?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = 50;
  const cx = 60;
  const cy = 60;

  let cumulative = 0;
  const slices = segments.map((seg, idx) => {
    const startAngle = (cumulative / total) * 360;
    cumulative += seg.value;
    const endAngle = (cumulative / total) * 360;
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return {
      d: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: seg.color,
      label: seg.label,
      pct: Math.round((seg.value / total) * 100),
      idx,
    };
  });

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 150 }}
      className="flex flex-col items-center gap-2"
    >
      <svg viewBox="0 0 120 120" width={120} height={120}>
        {slices.map((s, i) => (
          <motion.path
            key={i}
            d={s.d}
            fill={s.color}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.2 + i * 0.15, duration: 0.4 }}
            style={{ transformOrigin: "60px 60px" }}
          />
        ))}
        <circle cx={cx} cy={cy} r={20} fill="#fff" />
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fill="#1a1a1a"
        >
          {total.toLocaleString("vi-VN")}đ
        </text>
      </svg>
      <div className="flex flex-wrap gap-1 justify-center max-w-[160px]">
        {slices.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-1 text-[9px] font-bold"
            title={`${s.label}: ${s.pct}%`}
          >
            <div
              className="w-2 h-2 rounded-sm"
              style={{ background: s.color }}
            />
            <span style={{ color: s.color }}>{s.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ShieldProp({
  tone = "safe",
  delay = 0,
  large = false,
}: Extract<SceneProp, { type: "shield" }> & { delay?: number; large?: boolean }) {
  const size = large ? 120 : 80;
  const colors = tone === "safe"
    ? { fill: "#86efac", stroke: "#16a34a", symbol: "✓", symColor: "#15803d" }
    : { fill: "#fca5a5", stroke: "#dc2626", symbol: "!", symColor: "#7f1d1d" };
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 180 }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <path
          d="M 50 6 L 90 22 L 90 52 Q 90 80 50 96 Q 10 80 10 52 L 10 22 Z"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="3"
        />
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fontSize="40"
          fontWeight="900"
          fill={colors.symColor}
        >
          {colors.symbol}
        </text>
      </svg>
    </motion.div>
  );
}

function TreeProp({
  size,
  delay = 0,
  large = false,
}: Extract<SceneProp, { type: "tree" }> & { delay?: number; large?: boolean }) {
  const height = large ? 130 : 100;
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 120 }}
      style={{ width: 110, height: height + 10 }}
    >
      <svg viewBox="0 0 110 130" width={110} height={height + 10}>
        {/* Pot */}
        <rect x="38" y="105" width="34" height="20" rx="3" fill="#92400e" />
        {/* Trunk */}
        <motion.rect
          x="50"
          y={110 - size * 0.5}
          width="10"
          height={size * 0.5}
          fill="#78350f"
          initial={{ scaleY: 0.3 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.6 }}
          style={{ transformOrigin: "55px 125px" }}
        />
        {/* Crown */}
        <motion.circle
          cx="55"
          cy={110 - size * 0.5}
          r={size * 0.4}
          fill="#16a34a"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.4, type: "spring", stiffness: 160 }}
          style={{ transformOrigin: "55px 110px" }}
        />
        {/* Coins on tree */}
        {Array.from({ length: Math.min(5, Math.floor(size / 8)) }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const r = size * 0.4;
          const x = 55 + Math.cos(angle) * r * 0.7;
          const y = (110 - size * 0.5) + Math.sin(angle) * r * 0.7;
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="5"
              fill="#ffc83d"
              stroke="#d97706"
              strokeWidth="1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.6 + i * 0.1, type: "spring" }}
            />
          );
        })}
      </svg>
    </motion.div>
  );
}

function BankProp({
  label,
  delay = 0,
}: Extract<SceneProp, { type: "bank" }> & { delay?: number }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 160 }}
      className="relative"
      style={{ width: 110, height: 90 }}
    >
      <svg viewBox="0 0 110 90" width={110} height={90}>
        {/* Roof */}
        <path d="M 10 40 L 55 12 L 100 40 Z" fill="#7c2d12" />
        {/* Columns */}
        <rect x="20" y="42" width="10" height="36" fill="#f3f4f6" stroke="#1a1a1a" strokeWidth="1" />
        <rect x="50" y="42" width="10" height="36" fill="#f3f4f6" stroke="#1a1a1a" strokeWidth="1" />
        <rect x="80" y="42" width="10" height="36" fill="#f3f4f6" stroke="#1a1a1a" strokeWidth="1" />
        {/* Base */}
        <rect x="10" y="78" width="90" height="10" fill="#92400e" />
        {/* Door */}
        <rect x="48" y="55" width="14" height="23" fill="#1a1a1a" />
        {/* Dollar sign */}
        <text x="55" y="74" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">
          đ
        </text>
      </svg>
      {label && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
          {label}
        </div>
      )}
    </motion.div>
  );
}

function SparkleProp({ delay = 0 }: { delay?: number }) {
  const positions = [
    { x: "10%", y: "20%", size: 24, c: "#fbbf24" },
    { x: "85%", y: "30%", size: 20, c: "#a78bfa" },
    { x: "20%", y: "70%", size: 18, c: "#34d399" },
    { x: "78%", y: "75%", size: 22, c: "#f472b6" },
  ];
  return (
    <>
      {positions.map((p, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: p.x, top: p.y, fontSize: p.size, color: p.c }}
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 0.9, 1, 0],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            delay: delay + i * 0.25,
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 1.2,
          }}
        >
          ✦
        </motion.div>
      ))}
    </>
  );
}
