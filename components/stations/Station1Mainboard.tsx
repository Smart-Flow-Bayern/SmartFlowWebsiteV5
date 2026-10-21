'use client'

import { de } from '@/content/de'
import { useReveal } from '@/lib/scroll/stationHooks'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('mainboard')

export function Station1Mainboard() {
  const revealed = useReveal(WINDOW, de.station1.labels.length)
  return (
    <StationOverlay id="mainboard" range={WINDOW} align="left">
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
