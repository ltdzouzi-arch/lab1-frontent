import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // ← enables static export
  distDir: 'out',
};

export default nextConfig;
