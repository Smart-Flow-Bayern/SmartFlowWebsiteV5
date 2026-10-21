import { Color, MathUtils } from 'three'
import { colors } from '@/lib/brand/tokens'
import { STATION_PART, type PartName } from './model/parts'
import { stationAt } from './stations'

const FROM = new Color(colors.bg)
const TO = new Color(colors.bgLight)
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

/** Leuchtstärke eines Teils: aktives Teil 1.4, Geschwister 1.0, Leiterbahnen 0.25 (+0.5 am Mainboard), sonst 0.05. */
export function partEmissive(part: PartName, progress: number): number {
  const active = activePart(progress)
  if (part === active) return 1.4
  if (active && isRam(active) && isRam(part)) return 1.0
  if (part === 'traces') return stationAt(progress).id === 'mainboard' ? 0.75 : 0.25
  return 0.05
}
