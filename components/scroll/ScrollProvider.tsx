'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, type ReactNode } from 'react'
import type { SceneId } from '@/content/types'
import { resolveSceneSlug } from '@/lib/scroll/hash'
import { progressFromTops, scrollFromProgress } from '@/lib/scroll/map'
import { progressStore } from '@/lib/scroll/progress'
import { shouldRefresh, type Size } from '@/lib/scroll/resize'
import { SCENES } from '@/scene/process/scenes'

let lenisInstance: Lenis | null = null
/** Gemessene Oberkanten der sieben Sections in Seitenpixeln, in Szenenreihenfolge. */
let tops: number[] = []

declare global {
  interface Window {
    __sf?: { readonly progress: number }
  }
}

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Misst die Oberkanten der Sections (`section.scene`, sortiert nach `data-scene`) relativ zum Dokument. */
function measureTops(): number[] {
  const sections = [...document.querySelectorAll<HTMLElement>('#story section.scene')]
  sections.sort((a, b) => Number(a.dataset.scene) - Number(b.dataset.scene))
  return sections.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))
}

function currentScroll(): number {
  return lenisInstance ? lenisInstance.scroll : window.scrollY
}

function sceneFromHash() {
  let slug = location.hash.slice(1)
  try {
    slug = decodeURIComponent(slug)
  } catch {
    return undefined // kaputte Prozentkodierung: wie unbekannter Hash
  }
  return resolveSceneSlug(slug)
}

/** Scrollt an die gemessene Oberkante der Section (auch Kontakt). Unter reduzierter Bewegung immer sofort. */
export function scrollToScene(id: SceneId, opts?: { immediate?: boolean }): void {
  const index = SCENES.findIndex((s) => s.id === id)
  const measured = tops.length === SCENES.length ? tops : measureTops()
  const target = index >= 0 && measured[index] !== undefined ? measured[index] : 0
  const immediate = reducedMotion() || opts?.immediate === true
  if (lenisInstance) {
    lenisInstance.scrollTo(target, immediate ? { immediate: true } : undefined)
  } else {
    window.scrollTo({ top: target, behavior: immediate ? 'instant' : 'smooth' })
  }
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    // Resize gehört unserem Handler: ScrollTriggers eigener Resize-Refresh liefe danach und verschöbe progress.
    ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' })

    const lenis = new Lenis(reducedMotion() ? { autoRaf: false, smoothWheel: false, lerp: 1 } : { autoRaf: false })
    lenisInstance = lenis
    // ScrollTrigger bleibt mit Lenis synchron (für spätere Trigger), ist aber nicht mehr Quelle des Fortschritts.
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Kein Pin. Fortschritt stückweise linear über die gemessenen Section-Oberkanten:
    // Szene i oben am Viewport ⇒ i/6, Kontakt oben ⇒ 1. So bleiben Grafik und Text synchron.
    tops = measureTops()
    const update = () => progressStore.set(progressFromTops(currentScroll(), tops))
    lenis.on('scroll', update)
    update()

    if (process.env.NODE_ENV !== 'production') {
      window.__sf = {
        get progress() {
          return progressStore.get()
        },
      }
    }

    // Deep Link: #slug springt nach dem Refresh direkt zur Szene; unbekannte oder kaputte Hashes werden ignoriert.
    const linked = sceneFromHash()
    if (linked) {
      ScrollTrigger.refresh()
      scrollToScene(linked.id, { immediate: true })
    }
    // Nur echte Hash-Wechsel (Adressleiste, Zurück/Vor); history.replaceState der Navigation löst keinen aus.
    const onHashChange = () => {
      const target = sceneFromHash()
      if (target) scrollToScene(target.id)
    }
    window.addEventListener('hashchange', onHashChange)

    /** Neu messen und den Fortschritt halten (gleiche Stelle der Geschichte, nicht gleiche Pixelposition). */
    const remeasure = () => {
      const prev = progressStore.get()
      tops = measureTops()
      ScrollTrigger.refresh()
      lenis.resize()
      lenis.scrollTo(scrollFromProgress(prev, tops), { immediate: true, force: true })
      update()
    }
    let disposed = false
    // Webfonts ändern Zeilenumbrüche und damit Section-Höhen: einmal nach dem Laden neu messen.
    void document.fonts?.ready.then(() => {
      if (!disposed) remeasure()
    })

    let timer: ReturnType<typeof setTimeout> | undefined
    // lastSize wird nur beim Refresh aktualisiert: kleine Abweichungen summieren sich bis zur Schwelle.
    let lastSize: Size = { w: window.innerWidth, h: window.innerHeight }
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const next: Size = { w: window.innerWidth, h: window.innerHeight }
        if (!shouldRefresh(lastSize, next)) return
        lastSize = next
        remeasure()
      }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', onHashChange)
      tops = []
      progressStore.set(0)
      gsap.ticker.remove(tick)
      lenis.off('scroll', update)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      if (lenisInstance === lenis) lenisInstance = null
      if (process.env.NODE_ENV !== 'production') delete window.__sf
    }
  }, [])

  return <>{children}</>
}
