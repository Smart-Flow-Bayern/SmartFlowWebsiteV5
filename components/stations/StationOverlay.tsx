'use client'

import type { ReactNode } from 'react'
import { useProgress } from '@/lib/scroll/progress'
import { overlayState, type OverlayState } from '@/lib/scroll/visibility'

export type OverlaySlug = 'mainboard' | 'ueber' | 'cpu' | 'ram' | 'gpu' | 'ssd'

export function titleId(id: OverlaySlug): string {
  return `${id}-title`
}

interface Props {
  id: OverlaySlug
  window: { start: number; end: number }
  align: 'left' | 'right'
  children: ReactNode
}

export function StationOverlay({ id, window, align, children }: Props) {
  const state: OverlayState = overlayState(useProgress(), window)
  return (
    <section
      id={id}
      aria-labelledby={titleId(id)}
      className="station-overlay"
      data-state={state}
      data-align={align}
      inert={state === 'hidden'}
    >
      <div className="station-overlay-body">{children}</div>
    </section>
  )
}
