import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { IMPULSE_WORDMARK, UNDERSCORE } from "@/lib/brand/marks";
import { colors, wordmarkVariant } from "@/lib/brand/tokens";
import { STILL_PROGRESS, frame } from "@/scene/process/frame";
import { VIEWBOX } from "@/scene/process/layouts";

// Läuft in der Node-Laufzeit (Standard). `export const runtime` ist mit cacheComponents nicht erlaubt.

export const alt = "Smart Flow";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const WORDMARK_HEIGHT = 56;
const ACTIVE_NODES = [1, 5, 7];
const STAGE_HEIGHT = 330;

export default async function Image() {
  const [wordmark, mono] = await Promise.all([
    // Freigegebene Wortmarke mit Text als Pfaden, unabhängig vom Schrift-Renderer
    readFile(join(process.cwd(), `public/brand/wordmark-${wordmarkVariant}.svg`)),
    // Satori liest kein woff2, deshalb die statische woff-Instanz (600)
    readFile(join(process.cwd(), "public/fonts/jetbrains-mono-latin-600.woff")),
  ]);
  const { width, height } = (wordmarkVariant === "underscore" ? UNDERSCORE : IMPULSE_WORDMARK).box;

  const still = frame(STILL_PROGRESS, 0, { mobile: false, reduced: true });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: colors.ground,
        }}
      >
        <img
          src={`data:image/svg+xml;base64,${wordmark.toString("base64")}`}
          alt=""
          width={Math.round((WORDMARK_HEIGHT * width) / height)}
          height={WORDMARK_HEIGHT}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg
            viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
            width={Math.round((STAGE_HEIGHT * VIEWBOX.width) / VIEWBOX.height)}
            height={STAGE_HEIGHT}
          >
            {still.edges
              .filter((edge) => edge.opacity > 0)
              .map((edge) => (
                <path
                  key={`${edge.a}-${edge.b}`}
                  d={edge.d}
                  fill="none"
                  stroke={colors.nodeStroke}
                  strokeWidth={2}
                  strokeOpacity={edge.opacity}
                />
              ))}
            {still.nodes.map((node, i) => (
              <rect
                key={i}
                x={node.x - node.r}
                y={node.y - node.r}
                width={node.r * 2}
                height={node.r * 2}
                fill={ACTIVE_NODES.includes(i) ? colors.accent : colors.ground}
                stroke={ACTIVE_NODES.includes(i) ? colors.accent : colors.nodeStroke}
                strokeWidth={2}
              />
            ))}
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "JetBrains Mono" }}>
          <div style={{ fontSize: 44, color: colors.ink }}>Structure. Automation. Growth.</div>
          <div style={{ fontSize: 28, color: colors.muted }}>smartflow.bayern</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "JetBrains Mono", data: mono, style: "normal", weight: 600 }],
    },
  );
}
