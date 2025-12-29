/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=(), fullscreen=(self)",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: isDev
      ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://jubileegeneral.com.pk https://dev-retail.jubileegeneral.com.pk https://dev-coverage.jubileegeneral.com.pk https://retail-stage.jubileegeneral.com.pk http://localhost:3000 http://localhost:3001 http://localhost:3002; font-src 'self'; connect-src 'self' https://jubileegeneral.com.pk https://dev-retail.jubileegeneral.com.pk http://localhost:3000 http://localhost:3001 http://localhost:3002 http://localhost:3004 https://dev-coverage.jubileegeneral.com.pk https://retail-stage.jubileegeneral.com.pk https://images.unsplash.com"
      : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://jubileegeneral.com.pk https://dev-retail.jubileegeneral.com.pk https://motor.jubileegeneral.com.pk https://dev-coverage.jubileegeneral.com.pk https://retail-stage.jubileegeneral.com.pk; font-src 'self'; connect-src 'self' https://jubileegeneral.com.pk https://dev-retail.jubileegeneral.com.pk https://motor.jubileegeneral.com.pk https://dev-coverage.jubileegeneral.com.pk https://retail-stage.jubileegeneral.com.pk",
  },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-retail.jubileegeneral.com.pk",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "jubileegeneral.com.pk",
        port: "",
        pathname: "/motorApis/public/**",
      },
      {
        protocol: "https",
        hostname: "jubileegeneral.com.pk",
        port: "",
        pathname: "/jgi-motor/public/**",
      },
      {
        protocol: "https",
        hostname: "retail-stage.jubileegeneral.com.pk",
        port: "",
        pathname: "/motorApisUat/public/**",
      },
    ],
  },
};

export default nextConfig;
