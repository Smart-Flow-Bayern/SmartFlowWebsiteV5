'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, type ReactNode } from 'react'
import type { StationId } from '@/content/types'
import { progressStore } from '@/lib/scroll/progress'
import { SCROLL_HEIGHTS, STATIONS } from '@/scene/stations'

let lenisInstance: Lenis | null = null

/** Scrollweg, über den der Fortschritt von 0 auf 1 läuft (Bühne bleibt eine Höhe stehen). */
function travelDistance(): number {
  return (SCROLL_HEIGHTS - 1) * window.innerHeight
}

export function scrollToStation(id: StationId): void {
  const station = STATIONS.find((s) => s.id === id)
  if (!station) return
  const target = station.start * travelDistance()
  if (lenisInstance) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    lenisInstance.scrollTo(target, reduced ? { immediate: true } : undefined)
  } else {
    window.scrollTo(0, target)
  }
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({ autoRaf: false })
    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const trigger = ScrollTrigger.create({
      trigger: '#stage',
      start: 'top top',
      end: () => `+=${travelDistance()}`,
      pin: true,
      pinSpacing: false, // Platz liefert der Spacer in app/page.tsx
      invalidateOnRefresh: true,
      onUpdate: (self) => progressStore.set(self.progress),
    })

    let timer: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => ScrollTrigger.refresh(), 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      trigger.kill()
      gsap.ticker.remove(tick)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      if (lenisInstance === lenis) lenisInstance = null
    }
  }, [])

  return <>{children}</>
}
