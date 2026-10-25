export const colors = {
  ground: '#07090b',
  groundEnd: '#171b1f',
  ink: '#f1f3f2',
  muted: '#8d9794',
  line: 'rgba(241,243,242,.16)',
  nodeStroke: '#d7dcda',
  accent: '#ddff4d',
  accentInk: '#07090b',
} as const

export const fonts = {
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
} as const

// FREIGABE 1 (2026-10-21): Variante B, Bildmarke zwischen „smart“ und „flow“.
export const wordmarkVariant: 'underscore' | 'impulse' = 'impulse'
