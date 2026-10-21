import type { Metadata } from "next";
import { ContentProvider } from "@/components/content/ContentProvider";
import { CONTENT } from "@/content";
import { siteMetadata } from "@/lib/seo/metadata";
import { buildSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { fontClasses } from "@/app/fonts";
import "@/app/globals.css";

const content = CONTENT.de;

export const metadata: Metadata = siteMetadata("de");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${fontClasses} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={buildSchema("de", content)} />
        <ContentProvider content={content}>{children}</ContentProvider>
      </body>
    </html>
  );
}
