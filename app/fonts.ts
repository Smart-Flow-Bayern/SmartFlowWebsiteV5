import localFont from "next/font/local";

const schibsted = localFont({
  src: "../public/fonts/schibsted-grotesk-latin-wght.woff2",
  variable: "--font-schibsted",
  weight: "400 900",
  display: "swap",
});

const jetbrains = localFont({
  src: "../public/fonts/jetbrains-mono-latin-wght.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

export const fontClasses = `${schibsted.variable} ${jetbrains.variable}`;
