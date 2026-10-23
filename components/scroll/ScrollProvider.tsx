'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, type ReactNode } from 'react'
import type { SceneId } from '@/content/types'
import { resolveSceneSlug } from '@/lib/scroll/hash'
import { progressStore } from '@/lib/scroll/progress'
import { shouldRefresh, type Size } from '@/lib/scroll/resize'
import { sceneOffset } from '@/scene/process/scenes'

let lenisInstance: Lenis | null = null
let storyTrigger: ScrollTrigger | null = null

declare global {
  interface Window {
    __sf?: { readonly progress: number }
  }
}

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Scrollbereich der Story in Seitenpixeln: von #story oben am Viewport bis #story unten am Viewport. */
function storyRange(): { start: number; length: number } {
  if (storyTrigger) return { start: storyTrigger.start, length: Math.max(0, storyTrigger.end - storyTrigger.start) }
  const story = document.getElementById('story')
  if (!story) return { start: 0, length: 0 }
  const start = story.getBoundingClientRect().top + window.scrollY
  return { start, length: Math.max(0, story.offsetHeight - window.innerHeight) }
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

/** Scrollt an den Anfang des Szenenfensters (Kontakt: Story-Ende). Unter reduzierter Bewegung immer sofort. */
export function scrollToScene(id: SceneId, opts?: { immediate?: boolean }): void {
  const { start, length } = storyRange()
  const target = start + sceneOffset(id, length)
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
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Kein Pin: #story ist SCROLL_HEIGHTS Bildschirme hoch, Fortschritt 1, wenn die letzte Szene oben anliegt.
    const trigger = ScrollTrigger.create({
      trigger: '#story',
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate: (self) => progressStore.set(self.progress),
    })
    storyTrigger = trigger
    progressStore.set(trigger.progress)

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

    let timer: ReturnType<typeof setTimeout> | undefined
    // lastSize wird nur beim Refresh aktualisiert: kleine Abweichungen summieren sich bis zur Schwelle.
    let lastSize: Size = { w: window.innerWidth, h: window.innerHeight }
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const next: Size = { w: window.innerWidth, h: window.innerHeight }
        if (!shouldRefresh(lastSize, next)) return
        lastSize = next
        const prev = progressStore.get()
        ScrollTrigger.refresh()
        lenis.resize()
        // Fortschritt halten: gleiche Stelle der Story, nicht gleiche Pixelposition.
        lenis.scrollTo(trigger.start + prev * (trigger.end - trigger.start), { immediate: true, force: true })
        ScrollTrigger.update()
      }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', onHashChange)
      trigger.kill()
      if (storyTrigger === trigger) storyTrigger = null
      progressStore.set(0)
      gsap.ticker.remove(tick)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      if (lenisInstance === lenis) lenisInstance = null
      if (process.env.NODE_ENV !== 'production') delete window.__sf
    }
  }, [])

  return <>{children}</>
}
