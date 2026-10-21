'use client'

import { useMemo } from 'react'
import { useContent } from '@/components/content/ContentProvider'
import { NOISE_TERMS, NOISE_TERMS_EN } from '@/content/noise'
import { colors } from '@/lib/brand/tokens'
import { layoutNoise, noiseOpacity } from '@/lib/noise/layout'
import { useProgress } from '@/lib/scroll/progress'

const NOISE_SEED = 20261021
const PARTICLES = {
  de: layoutNoise(NOISE_TERMS, 72, NOISE_SEED),
  en: layoutNoise(NOISE_TERMS_EN, 72, NOISE_SEED),
}

// 72 Partikel im Markup; unter 768 px blendet CSS (.noise-particle in globals.css) alle ab Index 24 aus.
export function NoiseField({ count }: { count?: number }) {
  const { locale } = useContent()
  const particles = useMemo(() => PARTICLES[locale], [locale])
  const opacity = noiseOpacity(useProgress())
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity }}
    >
      {particles.slice(0, count ?? particles.length).map((p, i) => (
        <span
          key={i}
          data-noise=""
          className="noise-particle font-mono absolute whitespace-nowrap"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
            color: colors.muted,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.term}
        </span>
      ))}
    </div>
  )
}
