import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  // Lets other devices on the LAN load the dev server (e.g. http://192.168.1.33:3000).
  allowedDevOrigins: ["192.168.1.*"],
  // The browser only ever talks to this origin; /api/* is proxied to the Python backend.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }];
  },
};

export default nextConfig;
