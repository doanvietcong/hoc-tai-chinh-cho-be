/**
 * Text helpers cho Pé Ti stories.
 */

/**
 * Loại bỏ audio tags V3 ([excited] [whispers] [happy]...) khỏi text.
 * Dùng cho hiển thị UI và Web Speech API fallback (MP3 đã có tags baked-in).
 *
 * Ví dụ:
 *   stripAudioTags("[happy] Hôm nay Pé Ti vui! [excited]")
 *   → "Hôm nay Pé Ti vui!"
 */
export function stripAudioTags(text: string): string {
  return text
    // Remove patterns like [happy] [excited] [whispers] [sighs] etc.
    .replace(/\s*\[[a-z][\w\s-]*\]\s*/gi, " ")
    // Collapse multiple spaces
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Loại bỏ audio tags nhưng giữ dấu xuống dòng/câu rõ ràng.
 * (Hiện tại giống stripAudioTags, nhưng dành riêng cho fallback Web Speech.)
 */
export function cleanTextForSpeech(text: string): string {
  return stripAudioTags(text);
}
