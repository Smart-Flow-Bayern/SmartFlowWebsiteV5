import { colors } from '@/lib/brand/tokens'

// Gehäuse als Umriss: 1 px Linien in Flächenfarbe, eine Kante im Akzent.
export function CaseSilhouette() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 400"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] -translate-x-1/2 -translate-y-1/2"
      fill="none"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
    >
      <g stroke={colors.surface} vectorEffect="non-scaling-stroke">
        <rect x="40" y="20" width="220" height="360" />
        <rect x="56" y="40" width="188" height="260" />
        <line x1="56" y1="320" x2="244" y2="320" />
        <line x1="56" y1="340" x2="244" y2="340" />
        <line x1="40" y1="380" x2="40" y2="392" />
        <line x1="260" y1="380" x2="260" y2="392" />
      </g>
      <line x1="260" y1="20" x2="260" y2="380" stroke={colors.accent} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
