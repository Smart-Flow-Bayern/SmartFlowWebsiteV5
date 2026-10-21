'use client'

import { Wordmark } from '@/components/brand/Wordmark'
import { de } from '@/content/de'
import { wordmarkVariant } from '@/lib/brand/tokens'
import { ABOUT_WINDOW } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

export function About() {
  return (
    <StationOverlay id="ueber" range={ABOUT_WINDOW} align="left">
      <span aria-hidden="true" className="station-wordmark">
        <Wordmark variant={wordmarkVariant} size={18} />
      </span>
      <h2 id={titleId('ueber')} className="station-title">
        {de.about.heading}
      </h2>
      {de.about.sentences.map((sentence) => (
        <p key={sentence} className="station-text">
          {sentence}
        </p>
      ))}
    </StationOverlay>
  )
}
