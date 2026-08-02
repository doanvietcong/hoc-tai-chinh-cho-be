"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Penguin } from "@/components/mascot/Penguin";
import { useProgress } from "@/lib/store";
import { ageToGroup } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();
  const user = useProgress((s) => s.user);
  const setUser = useProgress((s) => s.setUser);

  const [step, setStep] = useState<"welcome" | "name" | "age">("welcome");
  const [name, setName] = useState("");
  const [age, setAge] = useState(8);

  // If user already exists, skip onboarding
  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user, router]);

  function handleStart() {
    setStep("name");
  }

  function handleNameNext() {
    if (name.trim().length === 0) return;
    setStep("age");
  }

  function handleFinish() {
    setUser({
      name: name.trim(),
      age,
      ageGroup: ageToGroup(age),
      createdAt: Date.now(),
    });
    router.push("/home");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-[#e8f8d8] via-white to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md text-center"
      >
        {step === "welcome" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Penguin mood="wave" size={180} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-green-dark">
              Pé Ti
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-text-muted">
              Học tài chính vui như chơi!
            </p>
            <p className="text-base text-text-muted text-balance">
              Xin chào! Mình là <b>Pé Ti</b> 🐧. Mình sẽ cùng bạn khám phá
              tiền, cách tiết kiệm thông minh, và nhiều điều thú vị nữa.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-sm font-semibold text-text-muted">
              <span className="rounded-full bg-[#d6f0fb] px-3 py-1 text-brand-blue">
                🎮 Vừa chơi vừa học
              </span>
              <span className="rounded-full bg-[#fff4cc] px-3 py-1 text-brand-yellow-dark">
                🐷 Học tiết kiệm
              </span>
              <span className="rounded-full bg-[#f0e0ff] px-3 py-1 text-brand-purple">
                🏆 Thành tích & huy hiệu
              </span>
            </div>
            <Button size="xl" variant="primary" onClick={handleStart} fullWidth>
              Bắt đầu nào!
            </Button>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Penguin mood="thinking" size={140} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark">
              Bạn tên gì nhỉ?
            </h2>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameNext()}
              placeholder="Ví dụ: An, Bình, Chi..."
              maxLength={20}
              className="w-full h-14 px-5 text-lg rounded-2xl border-2 border-b-4 border-[color:var(--color-border-strong)] focus:border-brand-blue outline-none text-center font-semibold"
            />
            <Button
              size="lg"
              variant="primary"
              fullWidth
              onClick={handleNameNext}
              disabled={name.trim().length === 0}
            >
              Tiếp tục
            </Button>
          </div>
        )}

        {step === "age" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Penguin mood="happy" size={140} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark">
              Chào {name}! Bạn mấy tuổi?
            </h2>
            <p className="text-text-muted">
              Pé Ti sẽ chọn bài học phù hợp với bạn.
            </p>

            <div className="bg-white rounded-3xl border-2 border-[color:var(--color-border-strong)] p-6">
              <p className="text-5xl font-extrabold text-brand-green-dark">
                {age} tuổi
              </p>
              <input
                type="range"
                min={5}
                max={15}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
                className="w-full mt-4 accent-brand-green"
              />
              <div className="flex justify-between text-xs font-semibold text-text-muted mt-1">
                <span>5</span>
                <span>10</span>
                <span>15</span>
              </div>
            </div>

            <div className="text-sm font-semibold text-text-muted">
              Nhóm tuổi:{" "}
              <span className="text-brand-blue">{ageToGroup(age)}</span>
            </div>

            <Button size="xl" variant="primary" onClick={handleFinish} fullWidth>
              Vào học thôi! 🚀
            </Button>
          </div>
        )}
      </motion.div>
    </main>
  );
}
