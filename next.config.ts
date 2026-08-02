import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export để deploy miễn phí lên Cloudflare Pages / Vercel / Netlify.
  // App này toàn client-side (Zustand + localStorage) nên không cần SSR.
  output: "export",
  images: {
    unoptimized: true,
  },
  // Tắt telemetry khi build
  productionBrowserSourceMaps: false,
};

export default nextConfig;
