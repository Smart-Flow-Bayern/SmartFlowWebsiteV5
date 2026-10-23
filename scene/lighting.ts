import { Color, MathUtils } from 'three'
import { colors } from '@/lib/brand/tokens'
import { STATION_PART, type PartName } from './model/parts'
import { stationAt } from './stations'

const FROM = new Color(colors.ground)
const TO = new Color(colors.groundEnd)
const mixed = new Color()

const clamp01 = (p: number) => Math.min(1, Math.max(0, p))

/** Hintergrundfarbe als Hex, von bg nach bgLight. */
export function backgroundAt(progress: number): string {
  return `#${mixed.copy(FROM).lerp(TO, clamp01(progress)).getHexString()}`
}

export function ambientAt(progress: number): number {
  return MathUtils.lerp(0.05, 0.9, clamp01(progress))
}

export function activePart(progress: number): PartName | null {
  return STATION_PART[stationAt(progress).id] ?? null
}

const isRam = (part: PartName) => part.startsWith('ram_')

/** Spitze der Leuchtstärke des aktiven Teils; höher übersteuert die Akzentfarbe zu flachem Gelbweiß und nimmt die Schattierung. */
export const EMISSIVE_PEAK = 0.4
/** RAM-Geschwister leuchten mit diesem Anteil der Spitze. */
export const EMISSIVE_SIBLING = EMISSIVE_PEAK * 0.7

/** Leuchtstärke eines Teils: aktives Teil EMISSIVE_PEAK, RAM-Geschwister 0.7 davon, Leiterbahnen 0.25 (+0.5 am Mainboard), sonst 0.05. */
export function partEmissive(part: PartName, progress: number): number {
  const active = activePart(progress)
  if (part === active) return EMISSIVE_PEAK
  if (active && isRam(active) && isRam(part)) return EMISSIVE_SIBLING
  if (part === 'traces') return stationAt(progress).id === 'mainboard' ? 0.75 : 0.25
  return 0.05
}
