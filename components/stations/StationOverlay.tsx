'use client'

import type { ReactNode } from 'react'
import type { ProgressWindow } from '@/lib/scroll/visibility'
import { useMode } from '@/lib/device/mode'
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
  scrollable?: boolean
  children: ReactNode
}

export function StationOverlay({ id, range, align, className, scrollable, children }: Props) {
  const state = useOverlayState(range)
  const staticMode = useMode() === 'static'
  if (staticMode) {
    return (
      <section
        id={id}
        aria-labelledby={titleId(id)}
        className={className ? `station-static ${className}` : 'station-static'}
        data-state="visible"
      >
        <div className="station-overlay-body">{children}</div>
      </section>
    )
  }
  return (
    <section
      id={id}
      aria-labelledby={titleId(id)}
      className={className ? `station-overlay ${className}` : 'station-overlay'}
      data-state={state}
      data-align={align}
      inert={state === 'hidden'}
    >
      <div className="station-overlay-body" data-lenis-prevent={scrollable ? '' : undefined}>
        {children}
      </div>
    </section>
  )
}
