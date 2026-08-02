"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn, formatVNNumber } from "@/lib/utils";

interface DayResult {
  day: number;
  weather: "sunny" | "cloudy" | "rainy";
  customers: number;
  sold: number;
  revenue: number;
  cost: number;
  profit: number;
}

const WEATHER = ["sunny", "sunny", "cloudy", "rainy", "sunny", "sunny", "cloudy"] as const;
const WEATHER_LABEL: Record<string, { emoji: string; label: string; mult: number }> = {
  sunny: { emoji: "☀️", label: "Nắng đẹp", mult: 1.5 },
  cloudy: { emoji: "⛅", label: "Âm u", mult: 1.0 },
  rainy: { emoji: "🌧️", label: "Mưa", mult: 0.4 },
};

const COST_PER_GLASS = 5000; // nguyên liệu 1 ly
const MAX_GLASSES_PER_DAY = 30;

interface Props {
  startCapital?: number;
  pricePerGlass?: number;
  days?: number;
  onComplete?: (totalProfit: number) => void;
}

export function LemonadeGame({
  startCapital = 50000,
  pricePerGlass = 12000,
  days = 7,
  onComplete,
}: Props) {
  const [day, setDay] = useState(0);
  const [capital, setCapital] = useState(startCapital);
  const [price, setPrice] = useState(pricePerGlass);
  const [glasses, setGlasses] = useState(10);
  const [results, setResults] = useState<DayResult[]>([]);
  const [done, setDone] = useState(false);

  function calculateCustomers(): number {
    const weatherMult = WEATHER_LABEL[WEATHER[day]].mult;
    const baseCustomers = Math.round(5 * weatherMult);
    // Giá càng cao thì khách càng ít (mỗi 1000đ giảm 1 khách)
    const priceMult = Math.max(0.3, 1 - (price - 10000) / 20000);
    return Math.max(0, Math.round(baseCustomers * priceMult));
  }

  function sellDay() {
    if (done) return;
    const customers = calculateCustomers();
    const sold = Math.min(glasses, customers);
    const revenue = sold * price;
    const cost = glasses * COST_PER_GLASS;
    const profit = revenue - cost;
    const result: DayResult = {
      day: day + 1,
      weather: WEATHER[day],
      customers,
      sold,
      revenue,
      cost,
      profit,
    };
    setResults((r) => [...r, result]);
    setCapital((c) => c + profit);
    if (day + 1 >= days) {
      setDone(true);
    } else {
      setDay((d) => d + 1);
      setGlasses(10); // reset
    }
  }

  function reset() {
    setDay(0);
    setCapital(startCapital);
    setPrice(pricePerGlass);
    setGlasses(10);
    setResults([]);
    setDone(false);
  }

  const totalProfit = capital - startCapital;

  if (done) {
    const rating =
      totalProfit > 30000
        ? { emoji: "🏆", label: "Ông chủ tuyệt vời!", color: "text-brand-yellow-dark" }
        : totalProfit > 0
          ? { emoji: "😊", label: "Làm ổn!", color: "text-brand-green" }
          : { emoji: "😅", label: "Cần điều chỉnh giá!", color: "text-brand-red" };

    return (
      <div className="bg-white rounded-3xl border-2 border-[color:var(--color-border-strong)] p-6 text-center space-y-4">
        <div className="text-6xl">{rating.emoji}</div>
        <h3 className={`text-2xl font-extrabold ${rating.color}`}>{rating.label}</h3>
        <p className="text-text-muted">
          Tổng lợi nhuận sau 7 ngày:{" "}
          <b className="text-2xl text-brand-green-dark">
            {totalProfit >= 0 ? "+" : ""}
            {formatVNNumber(totalProfit)}đ
          </b>
        </p>
        <div className="bg-surface p-3 rounded-2xl text-sm">
          <p className="font-bold mb-2">📊 Tổng kết tuần:</p>
          <div className="space-y-1 text-left max-h-40 overflow-y-auto">
            {results.map((r) => (
              <div key={r.day} className="flex justify-between">
                <span>
                  Ngày {r.day} - {WEATHER_LABEL[r.weather].emoji}
                </span>
                <span className={r.profit >= 0 ? "text-brand-green" : "text-brand-red"}>
                  {r.profit >= 0 ? "+" : ""}
                  {formatVNNumber(r.profit)}đ
                </span>
              </div>
            ))}
          </div>
        </div>
        <Button size="lg" variant="primary" onClick={reset} fullWidth>
          Chơi lại
        </Button>
      </div>
    );
  }

  const forecastCustomers = calculateCustomers();
  const forecastRevenue = forecastCustomers * price;
  const forecastCost = glasses * COST_PER_GLASS;
  const forecastProfit = Math.min(forecastRevenue, glasses * price) - forecastCost;

  return (
    <div className="space-y-4">
      <div className="bg-[#fff4cc] rounded-2xl border-2 border-brand-yellow p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-muted">Vốn hiện tại</p>
          <p className="text-2xl font-extrabold text-brand-yellow-dark">
            {formatVNNumber(capital)}đ
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-muted">Ngày</p>
          <p className="text-2xl font-extrabold text-brand-blue">
            {day + 1} / {days}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "rounded-2xl border-2 p-4 flex items-center gap-3",
          WEATHER[day] === "sunny" && "bg-[#fff8d4] border-brand-yellow",
          WEATHER[day] === "cloudy" && "bg-[#e8f4f8] border-brand-blue",
          WEATHER[day] === "rainy" && "bg-[#e0e8f0] border-text-muted",
        )}
      >
        <div className="text-5xl">{WEATHER_LABEL[WEATHER[day]].emoji}</div>
        <div>
          <p className="text-lg font-bold">{WEATHER_LABEL[WEATHER[day]].label}</p>
          <p className="text-sm text-text-muted">
            Dự báo: ~{forecastCustomers} khách hôm nay
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border-2 border-[color:var(--color-border-strong)] p-4">
          <p className="text-sm text-text-muted">Giá mỗi ly</p>
          <p className="text-xl font-extrabold text-brand-blue">{formatVNNumber(price)}đ</p>
          <div className="flex gap-1 mt-2">
            <button
              onClick={() => setPrice((p) => Math.max(5000, p - 1000))}
              className="flex-1 h-8 rounded-lg bg-surface border-2 border-[color:var(--color-border-strong)] font-bold"
            >
              −
            </button>
            <button
              onClick={() => setPrice((p) => Math.min(25000, p + 1000))}
              className="flex-1 h-8 rounded-lg bg-surface border-2 border-[color:var(--color-border-strong)] font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[color:var(--color-border-strong)] p-4">
          <p className="text-sm text-text-muted">Pha chế (ly)</p>
          <p className="text-xl font-extrabold text-brand-green-dark">{glasses}</p>
          <div className="flex gap-1 mt-2">
            <button
              onClick={() => setGlasses((g) => Math.max(0, g - 5))}
              className="flex-1 h-8 rounded-lg bg-surface border-2 border-[color:var(--color-border-strong)] font-bold"
            >
              −
            </button>
            <button
              onClick={() =>
                setGlasses((g) => Math.min(MAX_GLASSES_PER_DAY, g + 5))
              }
              className="flex-1 h-8 rounded-lg bg-surface border-2 border-[color:var(--color-border-strong)] font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-3 text-sm space-y-1">
        <p>
          💰 Nếu bán hết: doanh thu{" "}
          <b className="text-brand-green-dark">
            {formatVNNumber(Math.min(forecastCustomers, glasses) * price)}đ
          </b>
        </p>
        <p>
          💸 Chi phí nguyên liệu:{" "}
          <b className="text-brand-red">
            {formatVNNumber(forecastCost)}đ
          </b>
        </p>
        <p>
          📊 Lợi nhuận dự kiến:{" "}
          <b
            className={
              forecastProfit >= 0 ? "text-brand-green-dark" : "text-brand-red"
            }
          >
            {forecastProfit >= 0 ? "+" : ""}
            {formatVNNumber(forecastProfit)}đ
          </b>
        </p>
      </div>

      <Button size="lg" variant="primary" onClick={sellDay} fullWidth>
        Mở bán ngày {day + 1}!
      </Button>
    </div>
  );
}
