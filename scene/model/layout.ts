// Maße, die Modellbau und Animation gemeinsam brauchen. Bewusst ohne three-Import,
// damit die Szene sie laden kann, ohne den Modellbau ins Client-Bundle zu ziehen.

export const BOARD = { x: -0.03, y: 0.03, z: -0.08, width: 0.3, height: 0.34, thickness: 0.003 }
/** Vorderfläche des Mainboards (z), auf der alle Bauteile sitzen. */
export const BOARD_FRONT = BOARD.z + BOARD.thickness / 2
export const CPU = { x: -0.05, y: 0.1, size: 0.04, thickness: 0.006 }
export const SSD = { x: -0.05, y: -0.105, width: 0.08, height: 0.022, thickness: 0.003 }
/** Höhe der Leiterbahnen über der Platine. */
export const TRACE_Z = BOARD_FRONT + 0.0005

/** Leiterbahn von der CPU zur SSD mit Index `i` (xy-Eckpunkte). */
export function ssdTrace(i: number): [number, number][] {
  const y = CPU.y - 0.0175 + i * 0.005
  const x = CPU.x - CPU.size / 2 - 0.07 - i * 0.005
  const ssdY = SSD.y - 0.0035 + i * 0.001
  return [[CPU.x - CPU.size / 2, y], [x, y], [x, ssdY], [SSD.x - SSD.width / 2, ssdY]]
}

/** Längste Leiterbahn (SSD-Polylinie 0): Pfad des Lichtimpulses. */
export const IMPULSE_TRACE: readonly [number, number, number][] = ssdTrace(0).map(([x, y]) => [x, y, TRACE_Z])
