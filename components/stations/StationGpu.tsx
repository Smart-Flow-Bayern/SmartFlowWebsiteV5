'use client'

import { de } from '@/content/de'
import { useReveal } from '@/lib/scroll/stationHooks'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('gpu')

export function StationGpu() {
  // Desktop zeigt alle Zeilen; mobil nur das aktuelle Paar (data-current).
  const revealed = useReveal(WINDOW, de.gpu.before.length)
  return (
    <StationOverlay id="gpu" range={WINDOW} align="right">
      <h2 id={titleId('gpu')} className="station-title">
        {de.gpu.title}
      </h2>
      <p className="station-intro">{de.gpu.intro}</p>
      <div className="station-columns">
        <div>
          <h3 className="station-mono font-mono">Vorher</h3>
          <ul className="station-list">
            {de.gpu.before.map((line, i) => (
              <li key={line} className="station-text" data-current={i === revealed - 1}>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="station-mono font-mono station-mono-accent">Nachher</h3>
          <ul className="station-list">
            {de.gpu.after.map((line, i) => (
              <li key={line} className="station-text" data-current={i === revealed - 1}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StationOverlay>
  )
}
