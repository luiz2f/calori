import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "", // ou null
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
