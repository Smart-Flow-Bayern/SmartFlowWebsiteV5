import { colors, fonts } from "@/lib/brand/tokens";
import {
  IMPULSE_IN_WORDMARK,
  IMPULSE_PATH,
  IMPULSE_TRANSFORM,
  IMPULSE_WORDMARK,
  IMPULSE_WORDMARK_VIEWBOX,
  UNDERSCORE,
  UNDERSCORE_VIEWBOX,
  WORDMARK_FONT_SIZE,
  WORDMARK_FONT_WEIGHT,
  WORDMARK_LETTER_SPACING,
} from "@/lib/brand/marks";

type WordmarkProps = {
  variant: "underscore" | "impulse";
  /** Höhe in Pixeln; die Breite folgt aus dem Seitenverhältnis der Variante. */
  size?: number;
  className?: string;
  /** Rein dekorativ (z. B. in einem Link, der selbst beschriftet ist): aria-hidden statt role="img". */
  decorative?: boolean;
};

const textStyle = {
  fontFamily: fonts.mono,
  fontWeight: WORDMARK_FONT_WEIGHT,
  letterSpacing: WORDMARK_LETTER_SPACING,
} as const;

export function Wordmark({ variant, size = 32, className, decorative = false }: WordmarkProps) {
  const { box } = variant === "underscore" ? UNDERSCORE : IMPULSE_WORDMARK;
  const width = Math.round((size * box.width) / box.height);

  return (
    <svg
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Smart Flow" })}
      viewBox={variant === "underscore" ? UNDERSCORE_VIEWBOX : IMPULSE_WORDMARK_VIEWBOX}
      width={width}
      height={size}
      className={className}
    >
      {variant === "underscore" ? (
        <text x={UNDERSCORE.textX} y={0} fontSize={WORDMARK_FONT_SIZE} fill={colors.ink} style={textStyle}>
          smart<tspan fill={colors.accent}>_</tspan>flow
        </text>
      ) : (
        <>
          <path
            d={IMPULSE_PATH}
            transform={IMPULSE_TRANSFORM}
            fill="none"
            stroke={colors.accent}
            strokeWidth={IMPULSE_IN_WORDMARK.stroke}
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <text x={IMPULSE_WORDMARK.textX} y={0} fontSize={WORDMARK_FONT_SIZE} fill={colors.ink} style={textStyle}>
            {IMPULSE_WORDMARK.text}
          </text>
        </>
      )}
    </svg>
  );
}
