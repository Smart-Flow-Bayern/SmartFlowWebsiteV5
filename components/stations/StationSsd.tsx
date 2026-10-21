'use client'

import { de } from '@/content/de'
import { useReveal } from '@/lib/scroll/stationHooks'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('ssd')

export function StationSsd() {
  const revealed = useReveal(WINDOW, de.ssd.blocks.length)
  return (
    <StationOverlay id="ssd" range={WINDOW} align="left">
      <h2 id={titleId('ssd')} className="station-title">
        {de.ssd.title}
      </h2>
      <ol className="station-list">
        {de.ssd.blocks.map((block, i) => (
          <li key={block.name} className="reveal-item" data-revealed={i < revealed} data-current={i === revealed - 1}>
            <span className="station-mono station-mono-accent font-mono">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="station-block-name">{block.name}</h3>
            <p className="station-text">{block.happens}</p>
            <p className="station-text">{block.deliverable}</p>
            <p className="station-mono font-mono">{block.duration}</p>
          </li>
        ))}
      </ol>
    </StationOverlay>
  )
}
