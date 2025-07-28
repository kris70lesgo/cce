// next.config.ts (or .js if you're not using TypeScript)

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // you can add more config options here later
};

export default nextConfig;
