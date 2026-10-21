'use client'

import { de } from '@/content/de'
import { useProgressSelector } from '@/lib/scroll/progress'
import { useReveal } from '@/lib/scroll/stationHooks'
import { mainboardLabelIndex } from '@/scene/animations'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('mainboard')

export function Station1Mainboard() {
  const revealed = useReveal(WINDOW, de.station1.labels.length)
  const flashing = useProgressSelector(mainboardLabelIndex)
  return (
    <StationOverlay id="mainboard" range={WINDOW} align="left">
      <h2 id={titleId('mainboard')} className="station-title">
        {de.station1.claim}
      </h2>
      <ul className="station-labels font-mono">
        {de.station1.labels.map((label, i) => (
          <li key={label} className="reveal-item" data-revealed={i < revealed} data-flash={i === flashing}>
            {label}
          </li>
        ))}
      </ul>
    </StationOverlay>
  )
}
