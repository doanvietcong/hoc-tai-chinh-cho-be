import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { SoundSync } from "@/components/SoundSync";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pé Ti – Học tài chính vui như chơi",
  description:
    "Pé Ti giúp bé từ 5-15 tuổi học về tiền, tiết kiệm, nhu cầu & mong muốn qua các bài học tương tác vui nhộn.",
  icons: {
    icon: "/favicon.svg",
  },
  // Anti-cache: ensures browser always revalidates on visit
  // (helps users stuck on stale responses after Cloudflare deploys)
  other: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[color:var(--color-text)]">
        <SoundSync />
        {children}
      </body>
    </html>
  );
}
