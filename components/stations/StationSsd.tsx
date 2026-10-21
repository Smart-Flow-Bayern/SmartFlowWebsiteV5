'use client'

import { useContent } from '@/components/content/ContentProvider'
import { useReveal } from '@/lib/scroll/stationHooks'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('ssd')

export function StationSsd() {
  const content = useContent()
  const revealed = useReveal(WINDOW, content.ssd.blocks.length)
  return (
    <StationOverlay id="ssd" range={WINDOW} align="left">
      <h2 id={titleId('ssd')} className="station-title">
        {content.ssd.title}
      </h2>
      <ol className="station-list">
        {content.ssd.blocks.map((block, i) => (
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
