export interface Quality {
  dpr: [number, number]
  pointLights: number
  shadows: false
}

/** Breite bis einschließlich 768 px zählt als mobil (wie `max-width: 768px` im CSS). */
export const MOBILE_MAX_WIDTH = 768
const MOBILE_MAX_MEMORY_GB = 4

const MOBILE: Quality = { dpr: [1, 1.25], pointLights: 1, shadows: false }
const DESKTOP: Quality = { dpr: [1, 1.75], pointLights: 2, shadows: false }

/** Referenzstabil: liefert immer eine der zwei Konstanten. */
export function qualityFor(width: number, deviceMemory: number | undefined): Quality {
  const low = width <= MOBILE_MAX_WIDTH || (deviceMemory !== undefined && deviceMemory <= MOBILE_MAX_MEMORY_GB)
  return low ? MOBILE : DESKTOP
}

/** Nur im Browser aufrufen. */
export function currentQuality(): Quality {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  return qualityFor(window.innerWidth, memory)
}
