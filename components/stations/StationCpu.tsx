'use client'

import { de } from '@/content/de'
import { useReveal } from '@/lib/scroll/stationHooks'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('cpu')

export function StationCpu() {
  // Desktop zeigt alle Beispiele; mobil nur das aktuelle (data-current).
  const revealed = useReveal(WINDOW, de.cpu.examples.length)
  return (
    <StationOverlay id="cpu" range={WINDOW} align="right">
      <h2 id={titleId('cpu')} className="station-title">
        {de.cpu.title}
      </h2>
      <p className="station-intro">{de.cpu.intro}</p>
      <ul className="station-list">
        {de.cpu.examples.map((example, i) => (
          <li key={example.branch} data-current={i === revealed - 1}>
            <span className="station-mono font-mono">{example.branch}</span>
            <p className="station-text">{example.text}</p>
          </li>
        ))}
      </ul>
    </StationOverlay>
  )
}
