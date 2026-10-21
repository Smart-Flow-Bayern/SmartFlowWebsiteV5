import { colors } from "@/lib/brand/tokens";
import { IMPULSE_PATH, IMPULSE_STROKE, IMPULSE_VIEWBOX } from "@/lib/brand/marks";

type ImpulseProps = {
  size?: number;
  animated?: boolean;
  className?: string;
  /** Rein dekorativ: aria-hidden statt role="img". */
  decorative?: boolean;
};

const trace = {
  d: IMPULSE_PATH,
  fill: "none",
  strokeWidth: IMPULSE_STROKE,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
} as const;

// Bildmarke: Impuls auf einer Leiterbahn. Mit `animated` läuft ein heller Abschnitt
// die Bahn entlang (.impulse-run in app/globals.css, aus bei prefers-reduced-motion).
export function Impulse({ size = 32, animated = false, className, decorative = false }: ImpulseProps) {
  return (
    <svg
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Smart Flow" })}
      viewBox={IMPULSE_VIEWBOX}
      width={size}
      height={size}
      className={className}
    >
      <path {...trace} stroke={colors.accent} />
      {animated && <path {...trace} className="impulse-run" pathLength={100} stroke={colors.text} />}
    </svg>
  );
}
