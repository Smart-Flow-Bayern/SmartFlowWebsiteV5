import type { Metadata } from "next";
import localFont from "next/font/local";
import { de } from "@/content/de";
import "./globals.css";

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

export const metadata: Metadata = {
  title: de.meta.title,
  description: de.meta.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${schibsted.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
