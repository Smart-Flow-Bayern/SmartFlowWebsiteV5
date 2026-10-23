import { SCENE_IDS, type SceneId } from '@/content/types'

/** Scrollfenster einer Szene im Story-Fortschritt (0..1) und der Grafikzustand (0..5), den sie zeigt. */
export interface SceneWindow {
  id: SceneId
  slug: string
  state: number
  start: number
  end: number
}

/** Höhe von #story in Bildschirmen; der Scrollweg (progress 0..1) ist SCROLL_HEIGHTS - 1 = 6 Bildschirme. */
export const SCROLL_HEIGHTS = 7

/** Anzahl der Scrollfenster vor Kontakt (Kontakt liegt am Story-Ende). */
const WINDOWS = SCROLL_HEIGHTS - 1

/** Grafikzustand am Anfang jedes Fensters; Über hält Zustand 4, das Story-Ende ist Zustand 5. */
const STATE_AT = [0, 1, 2, 3, 4, 4, 5] as const

const slugOf = (id: SceneId): string => (id === 'komplexitaet' ? 'start' : id)

export const SCENES: readonly SceneWindow[] = Object.freeze(
  SCENE_IDS.map((id, i): SceneWindow =>
    i < WINDOWS
      ? { id, slug: slugOf(id), state: STATE_AT[i], start: i / WINDOWS, end: (i + 1) / WINDOWS }
      : { id, slug: slugOf(id), state: STATE_AT[i], start: 1, end: 1 },
  ),
)

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v))

/** Scrollfortschritt 0..1 → Grafikzustand 0..5, linear innerhalb jedes Fensters. */
export function stateProgress(scroll: number): number {
  const w = clamp01(scroll) * WINDOWS
  const i = Math.min(Math.floor(w), WINDOWS - 1)
  const a = STATE_AT[i]
  const b = STATE_AT[i + 1]
  return a + (b - a) * (w - i)
}

/** Letztes Fenster mit start <= scroll (Kontakt erst bei scroll = 1). */
export function sceneAt(scroll: number): SceneWindow {
  let found = SCENES[0]
  for (const s of SCENES) if (s.start <= scroll) found = s
  return found
}

/** Scrollziel in Pixeln für eine Szene bei `limit` Pixeln Scrollweg; aufgerundet, damit sceneAt dort die Szene trifft. */
export function sceneOffset(id: SceneId, limit: number): number {
  const scene = SCENES.find((s) => s.id === id)
  if (!scene || scene.start <= 0) return 0
  if (scene.start >= 1) return limit
  return Math.ceil(scene.start * limit - 1e-6)
}

export function sceneFromSlug(slug: string): SceneWindow | undefined {
  return SCENES.find((s) => s.slug === slug)
}
