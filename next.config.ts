import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "162.211.84.202",
        port: "3003",
        pathname: "/uploads/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
