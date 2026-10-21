'use client'

import { de } from '@/content/de'
import { useProgress } from '@/lib/scroll/progress'
import { revealIndex } from '@/lib/scroll/visibility'
import { STATIONS } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = STATIONS.find((s) => s.id === 'mainboard')!

export function Station1Mainboard() {
  const revealed = revealIndex(useProgress(), WINDOW, de.station1.labels.length)
  return (
    <StationOverlay id="mainboard" window={WINDOW} align="left">
      <h2 id={titleId('mainboard')} className="station-title">
        {de.station1.claim}
      </h2>
      <ul className="station-labels font-mono">
        {de.station1.labels.map((label, i) => (
          <li key={label} className="reveal-item" data-revealed={i < revealed}>
            {label}
          </li>
        ))}
      </ul>
    </StationOverlay>
  )
}
