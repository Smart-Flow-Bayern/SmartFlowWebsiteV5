'use client'

import { useContent } from '@/components/content/ContentProvider'
import { useReveal } from '@/lib/scroll/stationHooks'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('gpu')

export function StationGpu() {
  const content = useContent()
  // Desktop zeigt alle Zeilen; mobil nur das aktuelle Paar (data-current).
  const revealed = useReveal(WINDOW, content.gpu.before.length)
  return (
    <StationOverlay id="gpu" range={WINDOW} align="right">
      <h2 id={titleId('gpu')} className="station-title">
        {content.gpu.title}
      </h2>
      <p className="station-intro">{content.gpu.intro}</p>
      <div className="station-columns">
        <div>
          <h3 className="station-mono font-mono">{content.gpu.beforeLabel}</h3>
          <ul className="station-list">
            {content.gpu.before.map((line, i) => (
              <li key={line} className="station-text" data-current={i === revealed - 1}>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="station-mono font-mono station-mono-accent">{content.gpu.afterLabel}</h3>
          <ul className="station-list">
            {content.gpu.after.map((line, i) => (
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
