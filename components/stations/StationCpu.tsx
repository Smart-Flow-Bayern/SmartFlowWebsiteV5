'use client'

import { de } from '@/content/de'
import { STATIONS } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = STATIONS.find((s) => s.id === 'cpu')!

export function StationCpu() {
  return (
    <StationOverlay id="cpu" window={WINDOW} align="right">
      <h2 id={titleId('cpu')} className="station-title">
        {de.cpu.title}
      </h2>
      <p className="station-intro">{de.cpu.intro}</p>
      <ul className="station-list">
        {de.cpu.examples.map((example) => (
          <li key={example.branch}>
            <span className="station-mono font-mono">{example.branch}</span>
            <p className="station-text">{example.text}</p>
          </li>
        ))}
      </ul>
    </StationOverlay>
  )
}
