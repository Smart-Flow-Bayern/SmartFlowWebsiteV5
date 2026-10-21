export interface NoiseParticle {
  term: string
  x: number
  y: number
  delay: number
  duration: number
  size: number
}

// Kleiner seedbarer PRNG, damit Server und Client dasselbe Layout erzeugen.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const round = (n: number, digits = 2): number => Number(n.toFixed(digits))
const inCenterZone = (x: number, y: number): boolean => x >= 35 && x <= 65 && y >= 35 && y <= 65

/** Verteilt `count` Begriffe deterministisch; die Mitte (x, y je 35–65 %) bleibt frei. */
export function layoutNoise(terms: readonly string[], count: number, seed: number): NoiseParticle[] {
  const rand = mulberry32(seed)
  const particles: NoiseParticle[] = []
  for (let i = 0; i < count; i++) {
    let x = 0
    let y = 0
    do {
      x = round(rand() * 100)
      y = round(rand() * 100)
    } while (inCenterZone(x, y))
    particles.push({
      term: terms[i % terms.length],
      x,
      y,
      delay: round(rand() * 3),
      duration: round(1.2 + rand() * 2.3),
      size: Math.round(11 + rand() * 5),
    })
  }
  return particles
}

/** 1 bis 0.04 linear bis einschließlich Fortschritt 0.12, danach 0. */
export function noiseOpacity(progress: number): number {
  if (progress > 0.12) return 0
  return 1 - (progress / 0.12) * 0.96
}
