import type { Metadata } from "next";
import { ContentProvider } from "@/components/content/ContentProvider";
import { CONTENT } from "@/content";
import { siteMetadata } from "@/lib/seo/metadata";
import { buildSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { fontClasses } from "@/app/fonts";
import "@/app/globals.css";

const content = CONTENT;

export const metadata: Metadata = siteMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${fontClasses} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={buildSchema(content)} />
        <ContentProvider content={content}>{children}</ContentProvider>
      </body>
    </html>
  );
}
