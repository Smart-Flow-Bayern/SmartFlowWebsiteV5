import type { NextConfig } from "next";

// Statischer Export für GitHub Pages (Ordner out/). Pages kennt keine eigenen Header und Weiterleitungen:
// Die CSP steht als <meta>-Tag im Layout (lib/security/csp.ts), /en leitet über app/en/page.tsx weiter.
const nextConfig: NextConfig = {
  output: "export",
  // Jahr für die Fußzeile im Server-Render (lib/build-year.ts); zur Build-Zeit eingesetzt, Seite bleibt statisch.
  env: { BUILD_YEAR: String(new Date().getFullYear()) },
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
