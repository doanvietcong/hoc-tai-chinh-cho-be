/**
 * Audio helper: kiểm tra xem có file MP3 pre-rendered không.
 * Nếu có → dùng <audio> tag (giọng ElevenLabs V3 - "Thắm" Vietnamese).
 * Nếu không → fallback Web Speech API.
 *
 * Lưu ý: KHÔNG dùng Web Speech / FPT.AI / Vbee trong production.
 * Chỉ dùng ElevenLabs (xem scripts/generate-audio.js + .env.local).
 */

export interface AudioMeta {
  /** True nếu có file MP3 trong /public/audio. */
  available: boolean;
  /** URL tương đối tới file MP3 (chỉ valid khi available=true). */
  url: string | null;
}

/**
 * Tìm file audio cho scene cụ thể.
 * Files đặt tại /public/audio/{lessonId}/{sceneIdx}.mp3
 *
 * Note: đây chỉ là URL hint - nếu file không tồn tại thật,
 * <audio> sẽ fail và component sẽ fallback Web Speech API.
 */
export function getSceneAudio(
  lessonId: string,
  sceneIdx: number,
): AudioMeta {
  return {
    available: true,
    url: `/audio/${lessonId}/${sceneIdx}.mp3`,
  };
}
