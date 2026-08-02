/**
 * Sound effects dùng Web Audio API (zero MP3 files, free, instant).
 * Tất cả sounds đều dễ thương, ngắn gọn, không gây khó chịu khi lặp lại.
 */

let _ctx: AudioContext | null = null;
let _enabled = true;

/** Lazy-init AudioContext (browser yêu cầu user interaction). */
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (_ctx) return _ctx;
  const Ctor =
    (window as unknown as { AudioContext?: typeof AudioContext })
      .AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  try {
    _ctx = new Ctor();
    return _ctx;
  } catch {
    return null;
  }
}

/** Bật/tắt toàn bộ sounds (gọi từ store). */
export function setSoundEnabled(enabled: boolean) {
  _enabled = enabled;
}

/** Bật/tắt hiện tại (cho UI badge). */
export function isSoundEnabled() {
  return _enabled;
}

/** Resume audio context (gọi từ user interaction để tránh bị browser block). */
export function ensureAudio() {
  const ctx = getCtx();
  if (ctx && ctx.state === "suspended") {
    void ctx.resume();
  }
}

/* =====================================================
 * Low-level helpers
 * ===================================================== */

type Wave = "sine" | "square" | "triangle" | "sawtooth";

function tone(
  freq: number,
  duration: number,
  opts: {
    type?: Wave;
    volume?: number;
    attack?: number;
    decay?: number;
    startAt?: number;
    pitchEnd?: number;
  } = {},
) {
  const ctx = getCtx();
  if (!ctx || !_enabled) return;
  const t0 = ctx.currentTime + (opts.startAt ?? 0);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.pitchEnd ?? freq, t0);
  if (opts.pitchEnd && opts.pitchEnd !== freq) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(0.01, opts.pitchEnd),
      t0 + duration,
    );
  }
  const vol = opts.volume ?? 0.25;
  const attack = opts.attack ?? 0.01;
  const decay = opts.decay ?? duration;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + decay);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/* =====================================================
 * Public sound effects
 * ===================================================== */

/** Đúng! Cheerful arpeggio C5 → E5 → G5. */
export function playCorrect() {
  tone(523.25, 0.12, { volume: 0.25, startAt: 0 });
  tone(659.25, 0.12, { volume: 0.25, startAt: 0.1 });
  tone(783.99, 0.22, { volume: 0.3, startAt: 0.2 });
}

/** Sai! Low buzz + descending. */
export function playWrong() {
  tone(196, 0.18, { type: "square", volume: 0.18, pitchEnd: 130 });
  tone(146.83, 0.22, { type: "square", volume: 0.16, startAt: 0.15 });
}

/** Coin / lanh canh (khi nhận xu). */
export function playCoin() {
  tone(1318.51, 0.08, { type: "triangle", volume: 0.22 });
  tone(1567.98, 0.18, { type: "triangle", volume: 0.2, startAt: 0.06 });
}

/** Mất tim — sad descending. */
export function playHeartsLost() {
  tone(440, 0.12, { volume: 0.2, pitchEnd: 220 });
  tone(220, 0.18, { volume: 0.18, startAt: 0.12, pitchEnd: 110 });
}

/** Badge earned — fanfare 4 notes ascending. */
export function playBadgeEarned() {
  tone(523.25, 0.15, { volume: 0.28, startAt: 0 });
  tone(659.25, 0.15, { volume: 0.28, startAt: 0.12 });
  tone(783.99, 0.15, { volume: 0.28, startAt: 0.24 });
  tone(1046.5, 0.32, { volume: 0.32, startAt: 0.36, type: "triangle" });
}

/** Hoàn thành bài — victory arpeggio dài hơn. */
export function playLessonComplete() {
  tone(523.25, 0.18, { volume: 0.28, startAt: 0 });
  tone(659.25, 0.18, { volume: 0.28, startAt: 0.15 });
  tone(783.99, 0.18, { volume: 0.28, startAt: 0.3 });
  tone(1046.5, 0.55, { volume: 0.32, startAt: 0.45, type: "triangle" });
}

/** Story kết thúc — magical sparkle (nhiều high notes ngẫu nhiên). */
export function playStoryEnd() {
  const baseFreqs = [1568, 1760, 1975, 2093, 2349, 2637];
  for (let i = 0; i < 6; i++) {
    const f = baseFreqs[Math.floor(Math.random() * baseFreqs.length)];
    tone(f, 0.15, {
      type: "sine",
      volume: 0.18,
      startAt: i * 0.08,
    });
  }
}

/** Piggy bank oink — square sweep. */
export function playPiggyOink() {
  tone(220, 0.18, {
    type: "square",
    volume: 0.15,
    pitchEnd: 110,
  });
}

/** Click nhẹ UI (button, toggle). */
export function playClick() {
  tone(1200, 0.04, { type: "sine", volume: 0.12 });
}

/** Scene advance (chuyển scene trong story). */
export function playSceneAdvance() {
  tone(880, 0.06, { type: "sine", volume: 0.15 });
  tone(1108.73, 0.08, {
    type: "sine",
    volume: 0.15,
    startAt: 0.05,
  });
}

/** Hearts refilled. */
export function playHeartRefill() {
  tone(659.25, 0.1, { volume: 0.2, startAt: 0 });
  tone(880, 0.18, { volume: 0.22, startAt: 0.1 });
}

/** Aggregate map để dễ gọi. */
export const sfx = {
  correct: playCorrect,
  wrong: playWrong,
  coin: playCoin,
  heartsLost: playHeartsLost,
  badge: playBadgeEarned,
  lessonComplete: playLessonComplete,
  storyEnd: playStoryEnd,
  piggy: playPiggyOink,
  click: playClick,
  scene: playSceneAdvance,
  heart: playHeartRefill,
};
