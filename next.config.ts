import { existsSync } from "node:fs";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default function config(phase: string): NextConfig {
  // Secrets live in .dev.vars so OpenNext never bundles them; production reads Worker secrets.
  if (phase === PHASE_DEVELOPMENT_SERVER && existsSync(".dev.vars")) process.loadEnvFile(".dev.vars");
  return nextConfig;
}

initOpenNextCloudflareForDev();
