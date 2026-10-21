'use client'

import type { ReactNode } from 'react'
import type { ProgressWindow } from '@/lib/scroll/visibility'
import { useOverlayState } from '@/lib/scroll/stationHooks'

export type OverlaySlug = 'mainboard' | 'ueber' | 'cpu' | 'ram' | 'gpu' | 'ssd' | 'kontakt'

export function titleId(id: OverlaySlug): string {
  return `${id}-title`
}

interface Props {
  id: OverlaySlug
  range: ProgressWindow
  align: 'left' | 'right'
  className?: string
  children: ReactNode
}

export function StationOverlay({ id, range, align, className, children }: Props) {
  const state = useOverlayState(range)
  return (
    <section
      id={id}
      aria-labelledby={titleId(id)}
      className={className ? `station-overlay ${className}` : 'station-overlay'}
      data-state={state}
      data-align={align}
      inert={state === 'hidden'}
    >
      <div className="station-overlay-body" data-lenis-prevent={className ? '' : undefined}>{children}</div>
    </section>
  )
}
