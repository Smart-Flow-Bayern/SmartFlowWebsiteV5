export interface DeviceSignals {
  webgl2: boolean
  deviceMemory: number | undefined
  saveData: boolean
  reducedMotion: boolean
  forceFallback?: boolean
}

const MIN_MEMORY_GB = 4

/** Statischer Modus bei fehlendem WebGL2, wenig Speicher, Save-Data, reduzierter Bewegung oder `?fallback=1`. */
export function shouldUseStaticFallback(s: DeviceSignals): boolean {
  if (s.forceFallback) return true
  if (!s.webgl2) return true
  if (s.saveData) return true
  if (s.reducedMotion) return true
  return s.deviceMemory !== undefined && s.deviceMemory < MIN_MEMORY_GB
}

interface NavigatorSignals extends Navigator {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

export function readDeviceSignals(): DeviceSignals {
  const nav = navigator as NavigatorSignals
  const gl = document.createElement('canvas').getContext('webgl2')
  gl?.getExtension('WEBGL_lose_context')?.loseContext()
  return {
    webgl2: gl !== null,
    deviceMemory: nav.deviceMemory,
    saveData: nav.connection?.saveData === true,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    forceFallback: new URLSearchParams(location.search).get('fallback') === '1',
  }
}
