import { STATIONS } from '@/scene/stations'

// Alte v3-Anker (smartflow.bayern vor dem Relaunch). Der Server sieht Hash-Fragmente nicht,
// darum lösen wir sie hier im Client auf. hero, pains, audiences und faq haben kein Ziel.
const LEGACY_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  contact: 'kontakt',
  services: 'ablaeufe',
  process: 'ablauf',
  about: 'ueberblick',
})

export function resolveStationSlug(slug: string) {
  const wanted = Object.hasOwn(LEGACY_ALIASES, slug) ? LEGACY_ALIASES[slug] : slug
  return STATIONS.find((s) => s.slug === wanted)
}
