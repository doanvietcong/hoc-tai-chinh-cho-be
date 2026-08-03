"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DragSortQuestion } from "@/lib/types";

interface Props {
  question: DragSortQuestion;
  isChecked: boolean;
  isCorrect: boolean | null;
  onCheck: (placement: Record<string, string>) => void;
}

type Placement = Record<string, string>; // itemId -> bucketId

export function DragSortCard({
  question,
  isChecked,
  isCorrect,
  onCheck,
}: Props) {
  const [placement, setPlacement] = useState<Placement>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    setPlacement({});
    setSelectedItemId(null);
  }, [question.id]);

  const placedItemIds = new Set(Object.keys(placement));
  const remainingItems = question.items.filter(
    (it) => !placedItemIds.has(it.id),
  );
  const allPlaced = remainingItems.length === 0;

  function placeItem(itemId: string, bucketId: string) {
    if (isChecked) return;
    setPlacement((prev) => {
      const next = { ...prev };
      // If item is currently placed somewhere, remove it
      for (const k of Object.keys(next)) {
        if (next[k] === bucketId && k === itemId) {
          // toggle: click same bucket removes
          delete next[k];
          return next;
        }
        if (next[k] === bucketId && k !== itemId) {
          // bucket already has an item — replace
          delete next[k];
        }
      }
      next[itemId] = bucketId;
      return next;
    });
    setSelectedItemId(null);
  }

  function handleItemClick(itemId: string) {
    if (isChecked) return;
    // If already placed, remove it
    if (placement[itemId]) {
      removeItem(itemId);
      return;
    }
    setSelectedItemId((cur) => (cur === itemId ? null : itemId));
  }

  /** Remove an item from its bucket (back to the pool). */
  function removeItem(itemId: string) {
    if (isChecked) return;
    setPlacement((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setSelectedItemId(null);
  }

  function handleBucketClick(bucketId: string) {
    if (isChecked) return;
    if (!selectedItemId) return;
    placeItem(selectedItemId, bucketId);
  }

  function getBucketItems(bucketId: string) {
    return Object.entries(placement)
      .filter(([, b]) => b === bucketId)
      .map(([itemId]) => question.items.find((it) => it.id === itemId)!)
      .filter(Boolean);
  }

  function isItemInCorrectBucket(itemId: string) {
    const item = question.items.find((it) => it.id === itemId);
    if (!item) return false;
    return placement[itemId] === item.bucketId;
  }

  return (
    <div className="w-full mt-4 space-y-5">
      {/* Buckets */}
      <div
        className={cn(
          "grid gap-3",
          question.buckets.length === 2 && "grid-cols-2",
          question.buckets.length === 3 && "grid-cols-3",
          question.buckets.length === 4 && "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {question.buckets.map((bucket) => {
          const items = getBucketItems(bucket.id);
          const isBucketSelected = selectedItemId != null;
          return (
            <motion.button
              key={bucket.id}
              type="button"
              onClick={() => handleBucketClick(bucket.id)}
              whileTap={isBucketSelected ? { scale: 0.97 } : undefined}
              className={cn(
                "min-h-[120px] rounded-2xl border-2 border-dashed p-3 text-left",
                "flex flex-col gap-2 transition-colors",
                isBucketSelected
                  ? "border-brand-blue bg-[#d6f0fb]"
                  : "border-[color:var(--color-border-strong)] bg-white",
              )}
            >
              <div className="font-bold text-base flex items-center gap-1.5">
                {bucket.emoji && <span>{bucket.emoji}</span>}
                <span>{bucket.label}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((it) => {
                  const placedCorrectly = isItemInCorrectBucket(it.id);
                  return (
                    <motion.button
                      key={it.id}
                      type="button"
                      layout
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(it.id);
                      }}
                      title={isChecked ? undefined : "Bấm để gỡ ra"}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-1 text-sm font-semibold bg-white",
                        !isChecked && "border-[color:var(--color-border-strong)] hover:border-brand-red",
                        isChecked && placedCorrectly && "border-brand-green bg-[#d7ffb8]",
                        isChecked && !placedCorrectly && "border-brand-red bg-[#ffd7d7]",
                      )}
                    >
                      {it.emoji && <span>{it.emoji}</span>}
                      <span>{it.label}</span>
                      {isChecked && placedCorrectly && (
                        <Check size={14} className="text-brand-green" />
                      )}
                      {isChecked && !placedCorrectly && (
                        <X size={14} className="text-brand-red" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Remaining items pool */}
      <div
        className={cn(
          "min-h-[80px] rounded-2xl border-2 bg-[color:var(--color-surface)] p-3",
          "flex flex-wrap gap-2",
          allPlaced && "opacity-60",
        )}
      >
        {remainingItems.length === 0 && (
          <p className="text-text-muted text-sm w-full text-center italic">
            Đã xếp hết — bấm "Kiểm tra" nhé!
          </p>
        )}
        {remainingItems.map((it) => {
          const isSelected = selectedItemId === it.id;
          return (
            <motion.button
              key={it.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => handleItemClick(it.id)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border-2 px-3 py-1.5 text-sm font-semibold bg-white",
                isSelected
                  ? "border-brand-blue bg-[#d6f0fb]"
                  : "border-[color:var(--color-border-strong)]",
              )}
            >
              {it.emoji && <span>{it.emoji}</span>}
              <span>{it.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Hint for how to remove an item */}
      {!isChecked && Object.keys(placement).length > 0 && (
        <p className="text-text-muted text-xs text-center">
          💡 Bấm vào tờ tiền đã xếp để <strong>gỡ ra</strong> và xếp lại
        </p>
      )}

      {!isChecked && (
        <button
          type="button"
          disabled={!allPlaced}
          onClick={() => onCheck(placement)}
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

