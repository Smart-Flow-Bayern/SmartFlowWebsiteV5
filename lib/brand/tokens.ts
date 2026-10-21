export const colors = {
  bg: '#050607',
  bgLight: '#1A1D20',
  surface: '#141618',
  accent: '#DDFF4D',
  muted: '#7A8A8A',
  text: '#F4F6F5',
} as const

export const fonts = {
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
} as const

// FREIGABE 1 (2026-10-21): Variante B, Bildmarke zwischen „smart“ und „flow“.
export const wordmarkVariant: 'underscore' | 'impulse' = 'impulse'
