import { findeFloskeln } from '@/content/floskeln'
import type { SiteContent } from '@/content/types'

/** Jeder String-Wert des Inhalts, rekursiv durch Objekte und Arrays. */
export function alleTexte(content: SiteContent): string[] {
  const out: string[] = []
  const gehe = (wert: unknown): void => {
    if (typeof wert === 'string') out.push(wert)
    else if (Array.isArray(wert)) wert.forEach(gehe)
    else if (wert && typeof wert === 'object') Object.values(wert).forEach(gehe)
  }
  gehe(content)
  return out
}

/** Lowercase, Whitespace zusammengezogen, Satzzeichen am Ende entfernt. */
function normalisiere(satz: string): string {
  return satz
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?…:;,\s]+$/u, '')
}

function woerter(norm: string): number {
  return norm === '' ? 0 : norm.split(' ').length
}

function saetze(text: string): string[] {
  return (text.match(/[^.!?]+(?:[.!?]+|$)/g) ?? []).map((s) => s.trim()).filter(Boolean)
}

const MIN_WOERTER_TEILSTRING = 6

function istAltlast(norm: string, legacyNorm: readonly string[]): boolean {
  if (norm === '') return false
  return legacyNorm.some((l) => {
    if (norm === l) return true
    if (woerter(l) >= MIN_WOERTER_TEILSTRING && norm.includes(l)) return true
    return woerter(norm) >= MIN_WOERTER_TEILSTRING && l.includes(norm)
  })
}

function laenge(
  fehler: string[],
  pfad: string,
  arr: readonly unknown[],
  soll: number | readonly [number, number],
): void {
  const [min, max] = typeof soll === 'number' ? [soll, soll] : soll
  if (arr.length >= min && arr.length <= max) return
  const sollText = min === max ? String(min) : `${min}–${max}`
  fehler.push(`${pfad}: ${arr.length} statt ${sollText}`)
}

export function pruefeInhalt(
  content: SiteContent,
  legacy: string[],
): { floskeln: { text: string; treffer: string[] }[]; legacy: string[]; struktur: string[] } {
  const texte = alleTexte(content)

  const floskeln = texte
    .map((text) => ({ text, treffer: findeFloskeln(text) }))
    .filter((f) => f.treffer.length > 0)

  const legacyNorm = legacy.map(normalisiere)
  const treffer = new Set<string>()
  for (const text of texte) {
    for (const satz of saetze(text)) {
      if (istAltlast(normalisiere(satz), legacyNorm)) treffer.add(satz)
    }
  }

  const struktur: string[] = []
  laenge(struktur, 'station1.labels', content.station1.labels, 5)
  laenge(struktur, 'about.sentences', content.about.sentences, [2, 3])
  laenge(struktur, 'cpu.examples', content.cpu.examples, 3)
  laenge(struktur, 'ram.sticks', content.ram.sticks, 3)
  laenge(struktur, 'gpu.before', content.gpu.before, 3)
  laenge(struktur, 'gpu.after', content.gpu.after, 3)
  laenge(struktur, 'ssd.blocks', content.ssd.blocks, 4)

  return { floskeln, legacy: [...treffer], struktur }
}
