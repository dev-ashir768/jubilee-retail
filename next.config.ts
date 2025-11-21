import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",   // ← bas yeh ek line kafi hai ab

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