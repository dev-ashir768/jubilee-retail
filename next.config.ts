import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",     
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-retail.jubileegeneral.com.pk",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;