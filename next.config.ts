import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "@": "./src",
      "@/ui": "./src/ui",
      "@/components": "./src/components",
      "@/hooks": "./src/hooks",
      "@/infrastructure": "./src/infrastructure",
      "@/modules": "./src/modules",
      "@/shared": "./src/shared"
    }
  }
};

export default nextConfig;
