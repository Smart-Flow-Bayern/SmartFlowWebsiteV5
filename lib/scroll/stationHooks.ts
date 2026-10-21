'use client'

import { useMode } from '@/lib/device/mode'
import { useProgressSelector } from './progress'
import { overlayState, revealIndex, type OverlayState, type ProgressWindow } from './visibility'

export function useOverlayState(range: ProgressWindow): OverlayState {
  const staticMode = useMode() === 'static'
  const state = useProgressSelector((p) => overlayState(p, range))
  return staticMode ? 'visible' : state
}

export function useReveal(range: ProgressWindow, count: number): number {
  const staticMode = useMode() === 'static'
  const revealed = useProgressSelector((p) => revealIndex(p, range, count))
  return staticMode ? count : revealed
}
