import type { NextConfig } from "next";

// Nur im Production-Build: `next dev` braucht 'unsafe-eval' (React-Callstacks, HMR).
// 'wasm-unsafe-eval' für den Meshopt-Decoder (WebAssembly, eingebettet). Cal.com lädt erst nach Klick.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://cal.com https://*.cal.com",
  "frame-src https://cal.com https://*.cal.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ')

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    optimizePackageImports: ["three", "@react-three/drei"],
  },
  async headers() {
    const immutable = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      ...(process.env.NODE_ENV === "production"
        ? [{ key: "Content-Security-Policy", value: CSP }]
        : []),
    ];
    return [
      { source: "/:path*", headers: security },
      ...["/models/:path*", "/fonts/:path*", "/stations/:path*"].map(
        (source) => ({ source, headers: immutable }),
      ),
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
