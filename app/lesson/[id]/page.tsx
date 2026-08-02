import LessonClient from "./LessonClient";
import { ALL_LESSONS } from "@/lib/lessons";

/**
 * Pre-render all lesson pages at build time for static export.
 * Required for `output: "export"` mode.
 */
export function generateStaticParams() {
  return ALL_LESSONS.map((l) => ({ id: l.id }));
}

/** Always re-evaluate at build time, no ISR. */
export const dynamicParams = false;

export const metadata = {
  title: "Bài học – Pé Ti",
};

export default function LessonPage({ params }: { params: { id: string } }) {
  return <LessonClient lessonId={params.id} />;
}
