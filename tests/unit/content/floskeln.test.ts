import { describe, expect, it } from 'vitest'
import { FLOSKELN, findeFloskeln } from '@/content/floskeln'

describe('findeFloskeln', () => {
  it('findet Sperrwörter in der Reihenfolge der Liste', () => {
    expect(findeFloskeln('Wir bieten ganzheitliche Lösungen')).toEqual(['ganzheitlich', 'lösungen'])
  })

  it('findet Mehrwort-Floskeln', () => {
    expect(findeFloskeln('In Zeiten von KI')).toEqual(['in zeiten von'])
    expect(findeFloskeln('Ihr Partner  auf\nAugenhöhe')).toEqual(['partner auf augenhöhe'])
    expect(findeFloskeln('State of the Art')).toEqual(['state of the art'])
  })

  it('lässt saubere Texte durch', () => {
    expect(findeFloskeln('Wir streichen Doppelarbeit.')).toEqual([])
  })

  it('trifft Wortstamm am Wortanfang, auch bei Beugung und Zusammensetzung', () => {
    expect(findeFloskeln('nachhaltige Prozesse')).toEqual(['nachhaltig'])
    expect(findeFloskeln('Der Lösungsweg')).toEqual(['lösungen'])
    expect(findeFloskeln('Synergieeffekte')).toEqual(['synergien'])
  })

  it('trifft nicht mitten im Wort', () => {
    expect(findeFloskeln('Unnachhaltig')).toEqual([])
    expect(findeFloskeln('Auflösungen')).toEqual([])
  })

  it('ignoriert Groß-/Kleinschreibung und meldet jede Floskel nur einmal', () => {
    expect(findeFloskeln('INNOVATIV, innovativ, Innovative')).toEqual(['innovativ'])
  })

  it('behandelt Umlaute als Buchstaben', () => {
    expect(findeFloskeln('Maßgeschneidert')).toEqual(['maßgeschneidert'])
    expect(findeFloskeln('Äzukunftssicher')).toEqual([])
  })

  it('enthält die komplette Sperrliste in Kleinschreibung', () => {
    expect(FLOSKELN).toHaveLength(11)
    for (const f of FLOSKELN) expect(f).toBe(f.toLowerCase())
  })
})
