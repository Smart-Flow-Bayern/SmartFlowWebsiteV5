'use client'

import { useSyncExternalStore } from 'react'
import { MOBILE_MAX_WIDTH, currentQuality, qualityFor, type Quality } from './quality'

const SERVER_QUALITY = qualityFor(1440, undefined)

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export function useQuality(): Quality {
  return useSyncExternalStore(subscribe, currentQuality, () => SERVER_QUALITY)
}
