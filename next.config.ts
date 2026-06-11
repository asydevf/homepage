import type { NextConfig } from "next";

/**
 * Next.js 配置文件
 * 功能：配置图片域名白名单等设置
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.qqhkx.com",
      },
    ],
  },
};

export default nextConfig;
