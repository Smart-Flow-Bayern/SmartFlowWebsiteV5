import { CatmullRomCurve3, MathUtils, Vector3 } from 'three'
import type { StationId } from '@/content/types'
import { STATIONS } from './stations'

export interface Pose {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
}

/** Tiefe liegt auf z: die Kamera blickt entlang −z, die offene Seite des Gehäuses liegt bei z=+0.10. */
export const STATION_POSES: Record<StationId, Pose> = {
  gehaeuse: { position: [0.16, 0.1, 0.66], target: [0, 0, 0], fov: 40 },
  mainboard: { position: [0.1, 0.05, 0.42], target: [-0.03, 0.03, -0.08], fov: 35 },
  cpu: { position: [-0.02, 0.12, 0.14], target: [-0.05, 0.1, -0.07], fov: 30 },
  ram: { position: [0.16, 0.12, 0.08], target: [0.038, 0.1, -0.06], fov: 30 },
  gpu: { position: [0.05, -0.11, 0.12], target: [-0.03, -0.03, -0.058], fov: 32 },
  ssd: { position: [-0.03, -0.08, 0.04], target: [-0.05, -0.105, -0.077], fov: 28 },
  kontakt: { position: [-0.02, 0.16, 0.02], target: [-0.2215, 0.13, -0.05], fov: 35 },
}

/** Anteil des Stationsfensters, in dem die Pose steht. */
const PARK_FROM = 0.35
const PARK_TO = 0.85

const ORDER = STATIONS.map((s) => s.id)
const LAST = ORDER.length - 1
const poses = ORDER.map((id) => STATION_POSES[id])
const positionCurve = new CatmullRomCurve3(poses.map((p) => new Vector3(...p.position)))
const targetCurve = new CatmullRomCurve3(poses.map((p) => new Vector3(...p.target)))
const PARKS = STATIONS.map((s) => {
  const len = s.end - s.start
  return { from: s.start + PARK_FROM * len, to: s.start + PARK_TO * len }
})

const scratch = new Vector3()

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function newPose(): Pose {
  return { position: [0, 0, 0], target: [0, 0, 0], fov: 0 }
}

/**
 * Kamerapose zum Fortschritt. In den Parkfenstern steht die Stationspose exakt,
 * dazwischen läuft die Fahrt entlang einer Catmull-Rom-Kurve mit easeInOutCubic.
 * `out` kann wiederverwendet werden, um Allokationen pro Frame zu sparen.
 */
export function cameraPose(progress: number, out: Pose = newPose()): Pose {
  const p = Math.min(1, Math.max(0, progress))
  let index = LAST
  let u = 0
  if (p <= PARKS[0].to) {
    index = 0
  } else if (p >= PARKS[LAST].from) {
    index = LAST
  } else {
    for (let i = 0; i < LAST; i++) {
      if (p <= PARKS[i + 1].from) {
        index = i
        u = easeInOutCubic((p - PARKS[i].to) / (PARKS[i + 1].from - PARKS[i].to))
        break
      }
    }
  }
  u = Math.min(1, Math.max(0, u))
  const t = (index + u) / LAST
  positionCurve.getPoint(t, scratch).toArray(out.position)
  targetCurve.getPoint(t, scratch).toArray(out.target)
  const a = poses[index].fov
  const b = poses[Math.min(LAST, index + 1)].fov
  out.fov = MathUtils.lerp(a, b, u)
  return out
}
