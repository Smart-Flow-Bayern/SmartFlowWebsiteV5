'use client'

import { Impulse } from '@/components/brand/Impulse'
import { Wordmark } from '@/components/brand/Wordmark'
import { de } from '@/content/de'
import { useProgress } from '@/lib/scroll/progress'
import { overlayState } from '@/lib/scroll/visibility'
import { STATIONS } from '@/scene/stations'
import { colors, wordmarkVariant } from '@/lib/brand/tokens'
import { CaseSilhouette } from './CaseSilhouette'
import { NoiseField } from './NoiseField'

const WINDOW = STATIONS[0]

export function Station0() {
  // Bei progress 0 sofort sichtbar: hidden/entering zählen im eigenen Fenster als visible.
  const progress = useProgress()
  const raw = overlayState(progress, WINDOW)
  const state = progress >= WINDOW.end ? 'hidden' : raw === 'leaving' ? 'leaving' : 'visible'
  return (
    <div
      id="station0"
      data-state={state}
      inert={state === 'hidden'}
      className="station-fade pointer-events-none absolute inset-0 overflow-hidden"
    >
      <CaseSilhouette />
      <NoiseField />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <Wordmark variant={wordmarkVariant} size={32} />
        <h1
          className="font-sans max-w-md text-xl font-normal md:text-2xl"
          style={{ color: colors.text }}
        >
          {de.station0.sentence}
        </h1>
      </div>
      <div
        className="font-mono absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 text-sm"
        style={{ color: colors.muted }}
      >
        <span aria-hidden="true">
          <Impulse size={20} animated />
        </span>
        <span>{de.station0.scrollHint}</span>
      </div>
    </div>
  )
}
