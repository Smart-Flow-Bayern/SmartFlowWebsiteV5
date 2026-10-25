import { sceneFromSlug, type SceneWindow } from '@/scene/process/scenes'

// Alte Anker: v3 (smartflow.bayern vor dem Relaunch) und V5-Stationen. Der Server sieht Hash-Fragmente
// nicht, darum lösen wir sie hier im Client auf. Unbekanntes (hero, pains, audiences, faq) hat kein Ziel.
const LEGACY_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  contact: 'kontakt',
  services: 'struktur',
  process: 'analyse',
  about: 'ueber',
  ueberblick: 'analyse',
  ablaeufe: 'struktur',
  werkzeuge: 'struktur',
  automatik: 'automatisierung',
  ablauf: 'analyse',
})

export function resolveSceneSlug(slug: string): SceneWindow | undefined {
  const wanted = Object.hasOwn(LEGACY_ALIASES, slug) ? LEGACY_ALIASES[slug] : slug
  return sceneFromSlug(wanted)
}
