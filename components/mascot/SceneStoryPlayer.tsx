"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, X, RotateCcw } from "lucide-react";
import type { Story } from "@/lib/types";
import { SceneStage } from "./SceneStage";
import { cn } from "@/lib/utils";

interface Props {
  story: Story;
  /** Open/close */
  open: boolean;
  onClose: () => void;
  /** Optional class for outer container. */
  className?: string;
}

/**
 * Multi-scene story player. Plays each scene's text via Web Speech API
 * and auto-advances to the next scene on audio end.
 */
export function SceneStoryPlayer({ story, open, onClose, className }: Props) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentScene = story.scenes[sceneIdx];
  const totalScenes = story.scenes.length;

  const cancelAll = useCallback(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, []);

  const speakScene = useCallback(
    (idx: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setIsSupported(false);
        return;
      }
      const scene = story.scenes[idx];
      if (!scene) return;

      cancelAll();
      const utter = new SpeechSynthesisUtterance(scene.text);
      utter.lang = "vi-VN";
      const voices = window.speechSynthesis.getVoices();
      const vnVoice = voices.find((v) => v.lang.startsWith("vi"));
      if (vnVoice) utter.voice = vnVoice;
      utter.rate = 0.9;
      utter.pitch = 1.15;
      utter.volume = isMuted ? 0 : 1;
      utter.onstart = () => setIsPlaying(true);
      utter.onend = () => {
        setIsPlaying(false);
        // Auto-advance after a short pause
        if (idx + 1 < story.scenes.length) {
          advanceTimeoutRef.current = setTimeout(() => {
            setSceneIdx(idx + 1);
          }, 600);
        } else {
          setIsFinished(true);
        }
      };
      utter.onerror = () => {
        setIsPlaying(false);
        if (idx + 1 < story.scenes.length) {
          advanceTimeoutRef.current = setTimeout(() => {
            setSceneIdx(idx + 1);
          }, 800);
        } else {
          setIsFinished(true);
        }
      };
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    },
    [story.scenes, isMuted, cancelAll],
  );

  // When open changes, reset state
  useEffect(() => {
    if (open) {
      setSceneIdx(0);
      setIsFinished(false);
      // Preload voices
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
          };
        }
      }
    } else {
      cancelAll();
      setIsPlaying(false);
    }
  }, [open, cancelAll]);

  // When scene changes, auto-speak
  useEffect(() => {
    if (!open || isFinished) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }
    // Small delay so the scene change animation can play
    const t = setTimeout(() => speakScene(sceneIdx), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIdx, open, isFinished]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAll();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [cancelAll]);

  const handlePlayPause = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        speakScene(sceneIdx);
      }
    }
  };

  const handleSkip = () => {
    cancelAll();
    if (sceneIdx + 1 < story.scenes.length) {
      setSceneIdx(sceneIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setSceneIdx(0);
    setIsFinished(false);
  };

  const handleClose = () => {
    cancelAll();
    onClose();
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (utteranceRef.current) {
        utteranceRef.current.volume = 1;
        if (!isPlaying) speakScene(sceneIdx);
      }
    } else {
      setIsMuted(true);
      if (typeof window !== "undefined") {
        window.speechSynthesis.pause();
      }
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 z-50 bg-gradient-to-b from-[#1a1a2e] via-[#0f172a] to-[#1e1b4b]",
          "flex flex-col",
          className,
        )}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-3 text-white">
          <button
            onClick={handleClose}
            className="flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white p-1"
            aria-label="Đóng"
          >
            <X size={22} /> Đóng
          </button>
          <div className="text-center flex-1 px-2">
            <p className="text-[10px] uppercase tracking-wider text-white/60">
              Pé Ti kể chuyện
            </p>
            <p className="text-sm font-bold truncate">{story.title}</p>
          </div>
          <div className="text-xs font-bold text-white/70 w-16 text-right">
            {isFinished
              ? `✓ Xong`
              : `${sceneIdx + 1}/${totalScenes}`}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-red"
            initial={{ width: 0 }}
            animate={{
              width: `${((sceneIdx + (isFinished ? 1 : 0.5)) / totalScenes) * 100}%`,
            }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Scene stage */}
        <div className="flex-1 flex items-center justify-center p-3 sm:p-6">
          <div className="w-full max-w-2xl">
            {isFinished ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-6 sm:p-8 text-center"
              >
                <div className="text-6xl mb-3">🎉</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-purple mb-2">
                  Hết rồi nè!
                </h2>
                <p className="text-sm text-text-muted mb-5">
                  Bạn vừa nghe Pé Ti kể xong câu chuyện. Sẵn sàng làm bài chưa?
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-full text-sm font-bold bg-brand-yellow text-[#3c3c3c] hover:bg-[#ffd766]"
                  >
                    <RotateCcw size={16} /> Nghe lại
                  </button>
                  <button
                    onClick={handleClose}
                    className="inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-full text-sm font-bold bg-brand-purple text-white hover:bg-[#a55fe0]"
                  >
                    Bắt đầu làm bài →
                  </button>
                </div>
              </motion.div>
            ) : (
              currentScene && <SceneStage scene={currentScene} />
            )}
          </div>
        </div>

        {/* Controls */}
        {!isFinished && (
          <div className="bg-black/30 backdrop-blur px-3 sm:px-5 py-3 flex items-center justify-center gap-3">
            <button
              onClick={handleToggleMute}
              className="text-white/70 hover:text-white text-xs font-semibold px-2 py-1.5 rounded-full"
              aria-label={isMuted ? "Bật tiếng" : "Tắt tiếng"}
            >
              {isMuted ? "🔇 Bật" : "🔊 Tắt"}
            </button>
            <button
              onClick={handlePlayPause}
              disabled={!isSupported}
              className={cn(
                "flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg",
                isPlaying
                  ? "bg-brand-red hover:bg-[#e23d3d]"
                  : "bg-brand-green hover:bg-[#4ca54c]",
              )}
              aria-label={isPlaying ? "Tạm dừng" : "Phát"}
            >
              {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
            </button>
            <button
              onClick={handleSkip}
              className="text-white/70 hover:text-white text-xs font-semibold px-2 py-1.5 rounded-full flex items-center gap-1"
              aria-label="Bỏ qua"
            >
              <SkipForward size={14} /> Qua
            </button>
          </div>
        )}

        {!isSupported && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 text-center max-w-sm">
              <p className="text-2xl mb-2">😕</p>
              <p className="text-sm">
                Trình duyệt không hỗ trợ audio. Bạn vẫn có thể đọc nội dung ở trên.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-full text-sm font-bold bg-brand-purple text-white"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
