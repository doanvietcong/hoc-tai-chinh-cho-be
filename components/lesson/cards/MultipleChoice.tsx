"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MultipleChoiceQuestion } from "@/lib/types";

interface Props {
  question: MultipleChoiceQuestion;
  selectedOptionId: string | null;
  isChecked: boolean;
  isCorrect: boolean | null;
  onSelect: (optionId: string) => void;
}

export function MultipleChoiceCard({
  question,
  selectedOptionId,
  isChecked,
  isCorrect,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4">
      {question.options.map((opt) => {
        const isSelected = selectedOptionId === opt.id;
        const isCorrectOption = opt.id === question.correctOptionId;
        const showAsCorrect = isChecked && isCorrectOption;
        const showAsWrong =
          isChecked && isSelected && !isCorrectOption;

        return (
          <motion.button
            key={opt.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => !isChecked && onSelect(opt.id)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 text-left font-semibold transition-colors",
              "min-h-[64px]",
              !isChecked && !isSelected && "bg-white border-[color:var(--color-border-strong)] hover:bg-[#f3f3f3]",
              !isChecked && isSelected && "bg-[#d7f7ff] border-brand-blue",
              showAsCorrect && "bg-[#d7ffb8] border-brand-green",
              showAsWrong && "bg-[#ffd7d7] border-brand-red",
              isChecked && "cursor-default",
            )}
            disabled={isChecked}
          >
            {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
            <span className="flex-1 text-base text-[color:var(--color-text)]">
              {opt.label}
            </span>
            {showAsCorrect && (
              <Check className="text-brand-green" size={22} />
            )}
            {showAsWrong && <X className="text-brand-red" size={22} />}
          </motion.button>
        );
      })}
    </div>
  );
}
