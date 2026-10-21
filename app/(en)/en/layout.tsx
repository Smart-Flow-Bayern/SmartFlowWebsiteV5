import type { Metadata } from "next";
import { ContentProvider } from "@/components/content/ContentProvider";
import { CONTENT } from "@/content";
import { alternates } from "@/lib/i18n";
import { fontClasses } from "@/app/fonts";
import "@/app/globals.css";

const content = CONTENT.en;

export const metadata: Metadata = {
  metadataBase: new URL("https://smartflow.bayern"),
  title: content.meta.title,
  description: content.meta.description,
  alternates: alternates("en"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontClasses} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ContentProvider content={content}>{children}</ContentProvider>
      </body>
    </html>
  );
}
