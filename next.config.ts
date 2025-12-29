import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "67.222.13.55",
        port: "3002",
        pathname: "/uploads/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
