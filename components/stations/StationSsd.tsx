'use client'

import { de } from '@/content/de'
import { useProgress } from '@/lib/scroll/progress'
import { revealIndex } from '@/lib/scroll/visibility'
import { STATIONS } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = STATIONS.find((s) => s.id === 'ssd')!

export function StationSsd() {
  const revealed = revealIndex(useProgress(), WINDOW, de.ssd.blocks.length)
  return (
    <StationOverlay id="ssd" window={WINDOW} align="left">
      <h2 id={titleId('ssd')} className="station-title">
        {de.ssd.title}
      </h2>
      <ol className="station-list">
        {de.ssd.blocks.map((block, i) => (
          <li key={block.name} className="reveal-item" data-revealed={i < revealed}>
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
