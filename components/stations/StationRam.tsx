'use client'

import { de } from '@/content/de'
import { useProgress } from '@/lib/scroll/progress'
import { revealIndex } from '@/lib/scroll/visibility'
import { STATIONS } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = STATIONS.find((s) => s.id === 'ram')!

export function StationRam() {
  const revealed = revealIndex(useProgress(), WINDOW, de.ram.sticks.length)
  return (
    <StationOverlay id="ram" window={WINDOW} align="left">
      <h2 id={titleId('ram')} className="station-title">
        {de.ram.title}
      </h2>
      <p className="station-intro">{de.ram.intro}</p>
      <ul className="station-list">
        {de.ram.sticks.map((stick, i) => (
          <li key={stick} className="reveal-item station-text" data-revealed={i < revealed}>
            {stick}
          </li>
        ))}
      </ul>
    </StationOverlay>
  )
}
