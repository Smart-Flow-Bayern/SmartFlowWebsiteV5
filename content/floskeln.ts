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

const MUSTER = FLOSKELN.map((eintrag) => ({ eintrag, re: muster(eintrag) }))

/** Treffer der Sperrliste in `text`, in Reihenfolge von FLOSKELN, je höchstens einmal. */
export function findeFloskeln(text: string): string[] {
  return MUSTER.filter(({ re }) => re.test(text)).map(({ eintrag }) => eintrag)
}
