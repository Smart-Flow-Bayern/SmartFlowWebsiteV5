'use client'

import { de } from '@/content/de'
import { useReveal } from '@/lib/scroll/stationHooks'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('ram')

export function StationRam() {
  const revealed = useReveal(WINDOW, de.ram.sticks.length)
  return (
    <StationOverlay id="ram" range={WINDOW} align="left">
      <h2 id={titleId('ram')} className="station-title">
        {de.ram.title}
      </h2>
      <p className="station-intro">{de.ram.intro}</p>
      <ul className="station-list">
        {de.ram.sticks.map((stick, i) => (
          <li key={stick} className="reveal-item station-text" data-revealed={i < revealed} data-current={i === revealed - 1}>
            {stick}
          </li>
        ))}
      </ul>
    </StationOverlay>
  )
}
