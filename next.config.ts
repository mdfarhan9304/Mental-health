import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the tracing root to this project (a stray lockfile exists in $HOME).
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
