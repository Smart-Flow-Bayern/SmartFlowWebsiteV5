import type { Metadata } from "next";
import { ContentProvider } from "@/components/content/ContentProvider";
import { CONTENT } from "@/content";
import { siteMetadata } from "@/lib/seo/metadata";
import { buildSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { fontClasses } from "@/app/fonts";
import { CSP } from "@/lib/security/csp";
import "@/app/globals.css";

const content = CONTENT;

/** Läuft vor dem ersten Paint: Reduced Motion als Attribut, damit CSS die Bühne sofort statisch zeigt. */
const MOTION_SCRIPT =
  "if (matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.dataset.motion = 'reduced'";

export const metadata: Metadata = siteMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: das Inline-Script setzt data-motion vor der Hydration.
    <html lang="de" className={`${fontClasses} h-full antialiased`} suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "production" && <meta httpEquiv="Content-Security-Policy" content={CSP} />}
      </head>
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
        <JsonLd data={buildSchema(content)} />
        <ContentProvider content={content}>{children}</ContentProvider>
      </body>
    </html>
  );
}
