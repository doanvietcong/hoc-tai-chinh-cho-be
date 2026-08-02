"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn, formatVNNumber } from "@/lib/utils";

interface Toy {
  id: string;
  name: string;
  emoji: string;
  price: number;
  reason: string; // lý do nên/không nên mua
  type: "need" | "want";
}

const TOYS: Toy[] = [
  { id: "t1", name: "Bút chì màu", emoji: "✏️", price: 15000, reason: "Cần cho học tập", type: "need" },
  { id: "t2", name: "Sách truyện thiếu nhi", emoji: "📚", price: 25000, reason: "Đọc thêm giúp thông minh", type: "need" },
  { id: "t3", name: "Vở ô ly", emoji: "📓", price: 10000, reason: "Cần cho học tập", type: "need" },
  { id: "t4", name: "Mô hình robot", emoji: "🤖", price: 35000, reason: "Chỉ là đồ chơi giải trí", type: "want" },
  { id: "t5", name: "Kẹo", emoji: "🍬", price: 5000, reason: "Ăn vặt không bổ dưỡng", type: "want" },
  { id: "t6", name: "Balo học sinh", emoji: "🎒", price: 20000, reason: "Cần cho đi học", type: "need" },
  { id: "t7", name: "Bóng rổ", emoji: "🏀", price: 18000, reason: "Tốt cho sức khỏe", type: "need" },
  { id: "t8", name: "Đồ chơi nhập vai", emoji: "🎭", price: 30000, reason: "Giải trí", type: "want" },
];

interface Props {
  budget?: number;
  onComplete?: (score: number, itemsBought: number) => void;
}

export function ToyShopGame({ budget = 50000, onComplete }: Props) {
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [checkout, setCheckout] = useState(false);

  const total = TOYS.filter((t) => cart.has(t.id)).reduce(
    (sum, t) => sum + t.price,
    0,
  );
  const remaining = budget - total;
  const overBudget = remaining < 0;
  const needCount = TOYS.filter((t) => cart.has(t.id) && t.type === "need").length;
  const wantCount = TOYS.filter((t) => cart.has(t.id) && t.type === "want").length;

  function toggleCart(id: string) {
    if (checkout) return;
    setCart((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        // Tính thử nếu thêm vào
        const wouldBe = total + (TOYS.find((t) => t.id === id)?.price ?? 0);
        if (wouldBe > budget) return prev;
        next.add(id);
      }
      return next;
    });
  }

  function doCheckout() {
    if (overBudget || cart.size === 0) return;
    setCheckout(true);
    // Tính điểm: thưởng cho mỗi "need", phạt cho mỗi "want"
    const score = needCount * 10 - wantCount * 5;
    onComplete?.(Math.max(0, score), cart.size);
  }

  function reset() {
    setCart(new Set());
    setCheckout(false);
  }

  if (checkout) {
    const goodRatio = needCount >= wantCount;
    return (
      <div className="bg-white rounded-3xl border-2 border-[color:var(--color-border-strong)] p-6 text-center space-y-4">
        <div className="text-6xl">{goodRatio ? "🎉" : "🤔"}</div>
        <h3 className="text-2xl font-extrabold">
          {goodRatio ? "Mua sắm thông minh!" : "Cần cân nhắc thêm!"}
        </h3>
        <p className="text-text-muted">
          Bạn mua {cart.size} món, tổng {formatVNNumber(total)}đ. Còn dư{" "}
          <b className="text-brand-green-dark">{formatVNNumber(remaining)}đ</b>.
        </p>
        <div className="bg-surface p-4 rounded-2xl text-sm space-y-1">
          <p>✅ Đồ cần thiết: <b className="text-brand-green">{needCount}</b></p>
          <p>💖 Đồ muốn mua: <b className="text-brand-yellow-dark">{wantCount}</b></p>
          <p className="text-text-muted italic">
            {goodRatio
              ? "Bạn ưu tiên đồ cần thiết - rất tốt! 👍"
              : "Thử ưu tiên đồ cần thiết trước nhé!"}
          </p>
        </div>
        <Button size="lg" variant="primary" onClick={reset} fullWidth>
          Chơi lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#fff4cc] rounded-2xl border-2 border-brand-yellow p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-muted">Bạn có</p>
          <p className="text-2xl font-extrabold text-brand-yellow-dark">
            {formatVNNumber(budget)}đ
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-muted">Đã chọn</p>
          <p
            className={cn(
              "text-2xl font-extrabold",
              overBudget ? "text-brand-red" : "text-brand-green-dark",
            )}
          >
            {formatVNNumber(total)}đ
          </p>
          <p className="text-xs text-text-muted">
            Còn dư: {formatVNNumber(remaining)}đ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TOYS.map((toy) => {
          const isIn = cart.has(toy.id);
          return (
            <motion.button
              key={toy.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleCart(toy.id)}
              className={cn(
                "rounded-2xl border-2 p-3 text-left transition-colors",
                isIn
                  ? "border-brand-blue bg-[#d6f0fb]"
                  : "border-[color:var(--color-border-strong)] bg-white hover:bg-surface",
              )}
            >
              <div className="text-3xl text-center mb-1">{toy.emoji}</div>
              <p className="text-sm font-bold text-center">{toy.name}</p>
              <p
                className={cn(
                  "text-center text-sm font-bold mt-1",
                  toy.type === "need" ? "text-brand-green" : "text-brand-yellow-dark",
                )}
              >
                {formatVNNumber(toy.price)}đ
              </p>
              <p className="text-[10px] text-text-muted text-center mt-1 italic">
                {toy.type === "need" ? "Cần thiết" : "Muốn mua"}
              </p>
              {isIn && (
                <p className="text-[10px] text-brand-blue text-center mt-1 font-bold">
                  ✓ Đã chọn
                </p>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Button
          size="lg"
          variant="primary"
          onClick={doCheckout}
          disabled={cart.size === 0 || overBudget}
          fullWidth
        >
          Thanh toán ({cart.size} món)
        </Button>
        <Button size="lg" variant="ghost" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
