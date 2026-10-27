import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { IMPULSE_WORDMARK, UNDERSCORE } from "@/lib/brand/marks";
import { colors, wordmarkVariant } from "@/lib/brand/tokens";
import { OG_IMAGE } from "@/lib/seo/metadata";
import { STILL_PROGRESS, frame } from "@/scene/process/frame";
import { VIEWBOX } from "@/scene/process/layouts";

// Vorschaubild als Route /og.png statt Datei-Konvention opengraph-image.tsx: Der statische Export schreibt so
// out/og.png mit Endung, und GitHub Pages liefert die Datei als image/png aus. Wird beim Build einmal erzeugt.
export const dynamic = "force-static";

const size = { width: OG_IMAGE.width, height: OG_IMAGE.height };

const WORDMARK_HEIGHT = 56;
const ACTIVE_NODES = [1, 5, 7];
const STAGE_HEIGHT = 370;
// Mindestkante der Knotenquadrate im gerenderten Bild (px), umgerechnet in viewBox-Einheiten
const MIN_NODE_SIDE = (16 * VIEWBOX.height) / STAGE_HEIGHT;

export async function GET() {
  const [wordmark, mono] = await Promise.all([
    // Freigegebene Wortmarke mit Text als Pfaden, unabhängig vom Schrift-Renderer
    readFile(
      join(process.cwd(), `public/brand/wordmark-${wordmarkVariant}.svg`),
    ),
    // Satori liest kein woff2, deshalb die statische woff-Instanz (600)
    readFile(join(process.cwd(), "public/fonts/jetbrains-mono-latin-600.woff")),
  ]);
  const { width, height } = (
    wordmarkVariant === "underscore" ? UNDERSCORE : IMPULSE_WORDMARK
  ).box;

  const still = frame(STILL_PROGRESS, 0, { mobile: true, reduced: true });

  return new ImageResponse(
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
          {still.nodes.map((node, i) => {
            const side = Math.max(node.r * 2, MIN_NODE_SIDE);
            return (
              <rect
                key={i}
                x={node.x - side / 2}
                y={node.y - side / 2}
                width={side}
                height={side}
                fill={ACTIVE_NODES.includes(i) ? colors.accent : colors.ground}
                stroke={
                  ACTIVE_NODES.includes(i) ? colors.accent : colors.nodeStroke
                }
                strokeWidth={2}
              />
            );
          })}
        </svg>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          fontFamily: "JetBrains Mono",
        }}
      >
        <div style={{ fontSize: 44, color: colors.ink }}>
          Structure. Automation. Growth.
        </div>
        <div style={{ fontSize: 28, color: colors.muted }}>
          smartflow.bayern
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 600 },
      ],
    },
  );
}
