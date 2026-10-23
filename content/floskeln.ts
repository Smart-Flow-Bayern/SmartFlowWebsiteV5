/** Sperrliste aus den Global Constraints, kleingeschrieben. Jeder Treffer heißt: Satz neu schreiben. */
export const FLOSKELN: readonly string[] = [
  'ganzheitlich',
  'maßgeschneidert',
  'innovativ',
  'partner auf augenhöhe',
  'lösungen',
  'mehrwert',
  'nachhaltig',
  'zukunftssicher',
  'synergien',
  'state of the art',
  'in zeiten von',
]

/** Wortstamm, falls er vom Listeneintrag abweicht (Plural-Einträge treffen auch Singular und Komposita). */
const STAMM: Readonly<Record<string, string>> = {
  lösungen: 'lösung',
  synergien: 'synergie',
}

function muster(eintrag: string): RegExp {
  const stamm = STAMM[eintrag] ?? eintrag
  const teile = stamm.split(/\s+/).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  // \b kennt ä/ö/ü/ß nicht als Wortzeichen, daher Lookbehind auf Unicode-Buchstaben/Ziffern.
  return new RegExp(`(?<![\\p{L}\\p{N}])${teile.join('\\s+')}`, 'iu')
}

const MUSTER = new Map<readonly string[], { eintrag: string; re: RegExp }[]>()

function musterFuer(liste: readonly string[]): { eintrag: string; re: RegExp }[] {
  let m = MUSTER.get(liste)
  if (!m) {
    m = liste.map((eintrag) => ({ eintrag, re: muster(eintrag) }))
    MUSTER.set(liste, m)
  }
  return m
}

/** Treffer der Sperrliste in `text`, in Reihenfolge der Liste, je höchstens einmal. */
export function findeFloskeln(text: string, liste: readonly string[] = FLOSKELN): string[] {
  return musterFuer(liste)
    .filter(({ re }) => re.test(text))
    .map(({ eintrag }) => eintrag)
}
