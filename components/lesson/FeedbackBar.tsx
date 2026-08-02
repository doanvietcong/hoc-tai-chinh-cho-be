"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { randomCorrect, randomWrong } from "@/lib/utils";
import { Penguin } from "@/components/mascot/Penguin";

interface Props {
  show: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  explainer?: string;
  onContinue: () => void;
  canContinue?: boolean;
}

export function FeedbackBar({
  show,
  isCorrect,
  correctAnswer,
  explainer,
  onContinue,
  canContinue = true,
}: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 220 }}
          className="fixed bottom-0 left-0 right-0 z-30"
        >
          <div
            className={`${
              isCorrect ? "bg-[#d7ffb8]" : "bg-[#ffd7d7]"
            } border-t-4 ${
              isCorrect ? "border-brand-green" : "border-brand-red"
            }`}
          >
            <div className="mx-auto max-w-2xl px-4 py-4 sm:py-5 flex items-start gap-3 sm:gap-4">
              <div className="shrink-0">
                <Penguin
                  mood={isCorrect ? "happy" : "sad"}
                  size={64}
                  withShadow={false}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-lg sm:text-xl font-extrabold flex items-center gap-2 ${
                    isCorrect ? "text-brand-green-dark" : "text-brand-red-dark"
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <Check size={22} /> {randomCorrect()}
                    </>
                  ) : (
                    <>
                      <X size={22} /> {randomWrong()}
                    </>
                  )}
                </h3>
                {!isCorrect && (
                  <p className="text-sm sm:text-base font-semibold text-[color:var(--color-text)] mt-0.5">
                    Đáp án đúng: <span className="font-bold">{correctAnswer}</span>
                  </p>
                )}
                {explainer && (
                  <p className="text-sm sm:text-base text-[color:var(--color-text)] mt-1">
                    {explainer}
                  </p>
                )}
              </div>
              <Button
                size="lg"
                variant={isCorrect ? "primary" : "danger"}
                onClick={onContinue}
                disabled={!canContinue}
                className="shrink-0"
              >
                {isCorrect ? "Tiếp tục" : "Tiếp tục"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
