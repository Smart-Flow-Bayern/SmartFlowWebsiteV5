export interface Quality {
  dpr: [number, number]
  noiseCount: number
  pointLights: number
  shadows: false
}

/** Breite < 768 px zählt als mobil. */
export const MOBILE_MAX_WIDTH = 767
const MOBILE_MAX_MEMORY_GB = 4

const MOBILE: Quality = { dpr: [1, 1.25], noiseCount: 24, pointLights: 1, shadows: false }
const DESKTOP: Quality = { dpr: [1, 1.75], noiseCount: 72, pointLights: 2, shadows: false }

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
