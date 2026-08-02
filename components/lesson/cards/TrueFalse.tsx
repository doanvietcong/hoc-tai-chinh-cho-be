"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrueFalseQuestion } from "@/lib/types";

interface Props {
  question: TrueFalseQuestion;
  selected: boolean | null;
  isChecked: boolean;
  onSelect: (value: boolean) => void;
}

export function TrueFalseCard({
  question,
  selected,
  isChecked,
  onSelect,
}: Props) {
  const isCorrectTrue = question.correct === true;
  const showAsCorrectTrue = isChecked && isCorrectTrue;
  const showAsCorrectFalse = isChecked && !isCorrectTrue;
  const showAsWrongTrue = isChecked && selected === true && !isCorrectTrue;
  const showAsWrongFalse =
    isChecked && selected === false && isCorrectTrue;

  return (
    <div className="w-full mt-4 space-y-4">
      <div className="rounded-2xl border-2 border-[color:var(--color-border-strong)] bg-white p-5 text-center">
        <p className="text-lg sm:text-xl font-bold text-balance">
          {question.statement}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => !isChecked && onSelect(true)}
          disabled={isChecked}
          className={cn(
            "rounded-2xl border-2 border-b-4 px-4 py-5 font-bold text-lg flex flex-col items-center gap-2",
            !isChecked && selected !== true && "bg-white border-[color:var(--color-border-strong)] hover:bg-[#f3f3f3]",
            !isChecked && selected === true && "bg-[#d7f7ff] border-brand-blue",
            showAsCorrectTrue && "bg-[#d7ffb8] border-brand-green",
            showAsWrongTrue && "bg-[#ffd7d7] border-brand-red",
            isChecked && "cursor-default",
          )}
        >
          <span className="text-3xl">✅</span>
          <span>Đúng</span>
          {showAsCorrectTrue && <Check className="text-brand-green" />}
          {showAsWrongTrue && <X className="text-brand-red" />}
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => !isChecked && onSelect(false)}
          disabled={isChecked}
          className={cn(
            "rounded-2xl border-2 border-b-4 px-4 py-5 font-bold text-lg flex flex-col items-center gap-2",
            !isChecked && selected !== false && "bg-white border-[color:var(--color-border-strong)] hover:bg-[#f3f3f3]",
            !isChecked && selected === false && "bg-[#d7f7ff] border-brand-blue",
            showAsCorrectFalse && "bg-[#d7ffb8] border-brand-green",
            showAsWrongFalse && "bg-[#ffd7d7] border-brand-red",
            isChecked && "cursor-default",
          )}
        >
          <span className="text-3xl">❌</span>
          <span>Sai</span>
          {showAsCorrectFalse && <Check className="text-brand-green" />}
          {showAsWrongFalse && <X className="text-brand-red" />}
        </motion.button>
      </div>
    </div>
  );
}
