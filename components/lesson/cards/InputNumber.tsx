"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Eraser } from "lucide-react";
import { cn, formatVNNumber } from "@/lib/utils";
import type { InputNumberQuestion } from "@/lib/types";

interface Props {
  question: InputNumberQuestion;
  isChecked: boolean;
  isCorrect: boolean | null;
  onCheck: (value: number | null) => void;
}

export function InputNumberCard({ question, isChecked, isCorrect, onCheck }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    // Reset when question changes
    setValue("");
  }, [question.id]);

  function handleDigit(d: string) {
    if (isChecked) return;
    if (d === "C") {
      setValue("");
      return;
    }
    if (d === "⌫") {
      setValue((v) => v.slice(0, -1));
      return;
    }
    setValue((v) => (v.length >= 9 ? v : v + d));
  }

  function handleCheck() {
    if (value === "") return;
    onCheck(parseInt(value, 10));
  }

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];

  return (
    <div className="w-full mt-4 space-y-4">
      {question.hint && (
        <p className="text-sm text-text-muted text-center italic">
          💡 {question.hint}
        </p>
      )}

      <div
        className={cn(
          "rounded-2xl border-2 border-b-4 px-5 py-4 text-center",
          isChecked && isCorrect && "bg-[#d7ffb8] border-brand-green",
          isChecked && !isCorrect && "bg-[#ffd7d7] border-brand-red",
          !isChecked && "bg-white border-[color:var(--color-border-strong)]",
        )}
      >
        <p className="text-3xl sm:text-4xl font-extrabold tracking-wide tabular-nums">
          {value
            ? formatVNNumber(parseInt(value, 10))
            : <span className="text-text-soft">?</span>}
          {question.unit && (
            <span className="text-base text-text-muted ml-1">
              {question.unit}
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {digits.map((d) => (
          <motion.button
            key={d}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => handleDigit(d)}
            disabled={isChecked}
            className={cn(
              "h-14 rounded-xl border-2 border-b-4 text-xl font-bold bg-white",
              "border-[color:var(--color-border-strong)] hover:bg-[#f3f3f3]",
              "disabled:opacity-50",
              (d === "C" || d === "⌫") && "text-text-muted",
            )}
          >
            {d === "⌫" ? <Eraser size={20} className="mx-auto" /> : d}
          </motion.button>
        ))}
      </div>

      {!isChecked && (
        <button
          type="button"
          onClick={handleCheck}
          disabled={value === ""}
          className={cn(
            "mx-auto block h-12 px-8 rounded-2xl font-bold uppercase tracking-wide text-white",
            "bg-brand-green border-b-4 border-brand-green-dark",
            "hover:bg-[#4fad00] active:border-b-0 active:translate-y-1",
            "disabled:opacity-50",
          )}
        >
          Kiểm tra
        </button>
      )}
    </div>
  );
}
