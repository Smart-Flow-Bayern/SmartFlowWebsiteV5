'use client'

import { useContent } from '@/components/content/ContentProvider'
import { useReveal } from '@/lib/scroll/stationHooks'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('ram')

export function StationRam() {
  const content = useContent()
  const revealed = useReveal(WINDOW, content.ram.sticks.length)
  return (
    <StationOverlay id="ram" range={WINDOW} align="left">
      <h2 id={titleId('ram')} className="station-title">
        {content.ram.title}
      </h2>
      <p className="station-intro">{content.ram.intro}</p>
      <ul className="station-list">
        {content.ram.sticks.map((stick, i) => (
          <li key={stick} className="reveal-item station-text" data-revealed={i < revealed} data-current={i === revealed - 1}>
            {stick}
          </li>
        ))}
      </ul>
    </StationOverlay>
  )
}
