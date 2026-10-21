'use client'

import { useProgressSelector } from './progress'
import { overlayState, revealIndex, type OverlayState, type ProgressWindow } from './visibility'

export function useOverlayState(range: ProgressWindow): OverlayState {
  return useProgressSelector((p) => overlayState(p, range))
}

export function useReveal(range: ProgressWindow, count: number): number {
  return useProgressSelector((p) => revealIndex(p, range, count))
}
