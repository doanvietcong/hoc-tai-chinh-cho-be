"use client";

import { useEffect } from "react";
import { useProgress } from "@/lib/store";
import { setSoundEnabled } from "@/lib/sounds";

/**
 * Sync soundEnabled from Zustand store to the global sound module.
 * Mount once at the app root so every page respects the toggle.
 */
export function SoundSync() {
  const soundEnabled = useProgress((s) => s.soundEnabled);
  useEffect(() => {
    setSoundEnabled(soundEnabled);
  }, [soundEnabled]);
  return null;
}
