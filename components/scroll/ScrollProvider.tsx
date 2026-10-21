'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, type ReactNode } from 'react'
import type { StationId } from '@/content/types'
import { progressStore } from '@/lib/scroll/progress'
import { STATIONS, stationOffset } from '@/scene/stations'

let lenisInstance: Lenis | null = null

/** Maximal möglicher Scrollweg der Seite (unabhängig von svh/innerHeight-Abweichungen). */
function maxScroll(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

function stationFromHash() {
  let slug = location.hash.slice(1)
  try {
    slug = decodeURIComponent(slug)
  } catch {
    return undefined // kaputte Prozentkodierung: wie unbekannter Hash
  }
  return STATIONS.find((s) => s.slug === slug)
}

export function scrollToStation(id: StationId, opts?: { immediate?: boolean }): void {
  const station = STATIONS.find((s) => s.id === id)
  if (!station) return
  // Kontakt: ans Ende der Fahrt, denn sein Overlay erscheint erst nach 30 % des Fensters (Ruling Task 17).
  const target = stationOffset(id === 'kontakt' ? 1 : station.start, lenisInstance ? lenisInstance.limit : maxScroll())
  if (lenisInstance) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    lenisInstance.scrollTo(target, reduced || opts?.immediate ? { immediate: true } : undefined)
  } else {
    window.scrollTo(0, target)
  }
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis(
      reduced ? { autoRaf: false, smoothWheel: false, lerp: 1 } : { autoRaf: false },
    )
    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const trigger = ScrollTrigger.create({
      trigger: '#stage',
      start: 'top top',
      end: 'max',
      pin: true,
      pinSpacing: false, // Platz liefert der Spacer in app/page.tsx
      invalidateOnRefresh: true,
      onUpdate: (self) => progressStore.set(self.progress),
    })
    progressStore.set(trigger.progress)

    // Deep Link: #slug springt nach dem Refresh direkt zur Station; unbekannte oder kaputte Hashes werden ignoriert.
    const linked = stationFromHash()
    if (linked) {
      ScrollTrigger.refresh()
      scrollToStation(linked.id, { immediate: true })
    }
    // Nur echte Hash-Wechsel (Adressleiste, Zurück/Vor); history.replaceState der Punkte löst keinen aus.
    const onHashChange = () => {
      const target = stationFromHash()
      if (target) scrollToStation(target.id)
    }
    window.addEventListener('hashchange', onHashChange)

    let timer: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => ScrollTrigger.refresh(), 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', onHashChange)
      trigger.kill()
      progressStore.set(0)
      gsap.ticker.remove(tick)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      if (lenisInstance === lenis) lenisInstance = null
    }
  }, [])

  return <>{children}</>
}
