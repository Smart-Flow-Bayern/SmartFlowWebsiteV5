import type { Metadata } from "next";
import { ContentProvider } from "@/components/content/ContentProvider";
import { CONTENT } from "@/content";
import { siteMetadata } from "@/lib/seo/metadata";
import { buildSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { fontClasses } from "@/app/fonts";
import "@/app/globals.css";

const content = CONTENT.en;

export const metadata: Metadata = siteMetadata("en");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontClasses} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={buildSchema("en", content)} />
        <ContentProvider content={content}>{children}</ContentProvider>
      </body>
    </html>
  );
}
