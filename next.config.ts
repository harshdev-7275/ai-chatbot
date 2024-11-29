import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pinnacle.works",
        port: "",
        pathname: "/wp-content/uploads/**", // Adjust to match the image URL structure
      },
    ],
  },
  eslint: {
    // Warning: Thisp allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
