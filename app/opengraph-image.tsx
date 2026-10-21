import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { UNDERSCORE } from "@/lib/brand/marks";
import { colors } from "@/lib/brand/tokens";

// Läuft in der Node-Laufzeit (Standard). `export const runtime` ist mit cacheComponents nicht erlaubt.

export const alt = "Smart Flow";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const WORDMARK_HEIGHT = 120;

export default async function Image() {
  const [wordmark, mono] = await Promise.all([
    // Wortmarke A mit Text als Pfaden, unabhängig vom Schrift-Renderer
    readFile(join(process.cwd(), "public/brand/wordmark-underscore.svg")),
    // Satori liest kein woff2, deshalb die statische woff-Instanz (600)
    readFile(join(process.cwd(), "public/fonts/jetbrains-mono-latin-600.woff")),
  ]);
  const { width, height } = UNDERSCORE.box;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          background: colors.bg,
        }}
      >
        <img
          src={`data:image/svg+xml;base64,${wordmark.toString("base64")}`}
          alt=""
          width={Math.round((WORDMARK_HEIGHT * width) / height)}
          height={WORDMARK_HEIGHT}
        />
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 32, color: colors.muted }}>
          smartflow.bayern
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "JetBrains Mono", data: mono, style: "normal", weight: 600 }],
    },
  );
}
