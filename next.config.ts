import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // The about and stories pages were folded into the landing page
  redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/stories", destination: "/", permanent: true },
      { source: "/stories/:slug*", destination: "/", permanent: true }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com"
      },
      {
        protocol: "https",
        hostname: "img.youtube.com"
      }
    ]
  }
};

export default withNextIntl(nextConfig);
