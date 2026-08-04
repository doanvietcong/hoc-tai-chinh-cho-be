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

/** Force fully static rendering (no streaming RSC) for the lesson page.
 *  Ensures Cloudflare Pages serves a complete HTML file with body content
 *  instead of an RSC streaming payload that requires JS to render. */
export const dynamic = "force-static";

export const metadata = {
  title: "Bài học – Pé Ti",
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LessonClient lessonId={id} />;
}
