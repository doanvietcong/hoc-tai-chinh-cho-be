"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  /** Vietnamese text to speak. */
  text: string;
  /** Optional title shown above. */
  title?: string;
  /** Auto-play when mounted? Default false. */
  autoPlay?: boolean;
  /** Custom class. */
  className?: string;
}

/**
 * Story player using browser's Web Speech API.
 * Tells short stories in Vietnamese with the Pé Ti mascot.
 * Works offline, no API costs.
 */
export function StoryPlayer({ text, title, autoPlay = false, className }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }
    // Try to find a Vietnamese voice
    const tryLoadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const vnVoice = voices.find((v) => v.lang.startsWith("vi"));
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "vi-VN";
      if (vnVoice) utter.voice = vnVoice;
      utter.rate = 0.9; // chậm một chút cho trẻ em
      utter.pitch = 1.15; // giọng vui tươi
      utter.volume = 1;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      utteranceRef.current = utter;
    };
    tryLoadVoice();
    // Some browsers load voices async
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = tryLoadVoice;
    }
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [text]);

  function play() {
    if (!utteranceRef.current) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utteranceRef.current);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  function toggleMute() {
    if (isMuted) {
      // Bật tiếng: resume speech
      setIsMuted(false);
      if (utteranceRef.current) {
        utteranceRef.current.volume = 1;
        if (!isSpeaking) play();
      }
    } else {
      // Tắt tiếng: pause speech
      setIsMuted(true);
      window.speechSynthesis.pause();
    }
  }

  if (!isSupported) {
    return (
      <div className={cn("text-xs text-text-muted italic", className)}>
        Trình duyệt không hỗ trợ audio. Bạn vẫn có thể đọc nội dung bên dưới.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-2xl border-2 border-[color:var(--color-border-strong)] bg-[#f8f4ff] p-4 flex items-start gap-3",
        className,
      )}
    >
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-3xl shrink-0"
          >
            🐧
          </motion.div>
        )}
        {!isSpeaking && (
          <div className="text-3xl shrink-0">🐧</div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-bold text-brand-purple mb-1">{title}</p>
        )}
        <p className="text-sm text-[color:var(--color-text)] leading-relaxed">
          {text}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={isSpeaking ? stop : play}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-bold transition-colors",
              isSpeaking
                ? "bg-brand-red text-white"
                : "bg-brand-purple text-white hover:bg-[#a55fe0]",
            )}
            aria-label={isSpeaking ? "Dừng" : "Nghe Pé Ti kể"}
          >
            {isSpeaking ? (
              <>
                <Pause size={14} /> Dừng
              </>
            ) : (
              <>
                <Play size={14} /> Nghe Pé Ti kể
              </>
            )}
          </button>
          <button
            onClick={toggleMute}
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-semibold bg-white border-2 border-[color:var(--color-border-strong)] hover:bg-surface"
            aria-label={isMuted ? "Bật tiếng" : "Tắt tiếng"}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {isMuted ? "Bật" : "Tắt"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
