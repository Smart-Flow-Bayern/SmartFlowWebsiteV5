'use client'

import { de } from '@/content/de'
import { STATIONS } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = STATIONS.find((s) => s.id === 'gpu')!

export function StationGpu() {
  return (
    <StationOverlay id="gpu" window={WINDOW} align="right">
      <h2 id={titleId('gpu')} className="station-title">
        {de.gpu.title}
      </h2>
      <p className="station-intro">{de.gpu.intro}</p>
      <div className="station-columns">
        <div>
          <h3 className="station-mono font-mono">Vorher</h3>
          <ul className="station-list">
            {de.gpu.before.map((line) => (
              <li key={line} className="station-text">
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="station-mono font-mono station-mono-accent">Nachher</h3>
          <ul className="station-list">
            {de.gpu.after.map((line) => (
              <li key={line} className="station-text">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StationOverlay>
  )
}
