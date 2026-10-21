'use client'

import { useContent } from '@/components/content/ContentProvider'
import { useReveal } from '@/lib/scroll/stationHooks'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('cpu')

export function StationCpu() {
  const content = useContent()
  // Desktop zeigt alle Beispiele; mobil nur das aktuelle (data-current).
  const revealed = useReveal(WINDOW, content.cpu.examples.length)
  return (
    <StationOverlay id="cpu" range={WINDOW} align="right">
      <h2 id={titleId('cpu')} className="station-title">
        {content.cpu.title}
      </h2>
      <p className="station-intro">{content.cpu.intro}</p>
      <ul className="station-list">
        {content.cpu.examples.map((example, i) => (
          <li key={example.branch} data-current={i === revealed - 1}>
            <span className="station-mono font-mono">{example.branch}</span>
            <p className="station-text">{example.text}</p>
          </li>
        ))}
      </ul>
    </StationOverlay>
  )
}
