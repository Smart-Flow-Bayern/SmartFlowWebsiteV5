'use client'

import { Wordmark } from '@/components/brand/Wordmark'
import { useContent } from '@/components/content/ContentProvider'
import { wordmarkVariant } from '@/lib/brand/tokens'
import { ABOUT_WINDOW } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

export function About() {
  const content = useContent()
  return (
    <StationOverlay id="ueber" range={ABOUT_WINDOW} align="left">
      <span aria-hidden="true" className="station-wordmark">
        <Wordmark variant={wordmarkVariant} size={18} />
      </span>
      <h2 id={titleId('ueber')} className="station-title">
        {content.about.heading}
      </h2>
      {content.about.sentences.map((sentence) => (
        <p key={sentence} className="station-text">
          {sentence}
        </p>
      ))}
    </StationOverlay>
  )
}
