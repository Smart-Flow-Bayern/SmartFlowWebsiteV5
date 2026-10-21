// Sammelt Sätze aus v3/V4 für den Altlasten-Abgleich (lib/content/check.ts). Neu erzeugen: pnpm content:legacy
// Liest nur Startseiten-Quellen, keine Rechtstexte; Quellrepos bleiben unverändert.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const GITHUB = '/Users/leon/Documents/GitHub'
const QUELLEN = {
  html: [
    join(GITHUB, 'SmartFlowWebsite-v3/index.html'),
    join(GITHUB, 'SmartFlowWebsite-v3/en/index.html'),
  ],
  tsx: [
    join(GITHUB, 'SmartFlowWebsiteV4/app/page.tsx'),
    join(GITHUB, 'SmartFlowWebsiteV4/components/smartflow.tsx'),
  ],
}
const MIN_WOERTER = 4

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß',
  ndash: '–', mdash: '—', hellip: '…', bdquo: '„', ldquo: '“', rdquo: '”',
}

function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n] ?? m)
}

function textAusHtml(html: string): string[] {
  const ohne = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, '\n')
  return [decode(ohne)]
}

function textAusTsx(src: string): string[] {
  const teile: string[] = []
  // JSX-Text zwischen Tags, ohne Ausdrücke in geschweiften Klammern
  for (const m of src.matchAll(/>([^<>{}]+)</g)) teile.push(m[1])
  // String-Literale (Daten-Arrays, Props)
  for (const m of src.matchAll(/(["'`])((?:\\.|(?!\1)[^\\\n])+)\1/g)) teile.push(m[2])
  return teile.map(decode)
}

function saetze(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((zeile) => zeile.match(/[^.!?]+[.!?]*/g) ?? [])
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => /\p{L}/u.test(s) && s.split(' ').length >= MIN_WOERTER)
}

const alle = new Set<string>()
for (const pfad of QUELLEN.html) textAusHtml(readFileSync(pfad, 'utf8')).flatMap(saetze).forEach((s) => alle.add(s))
for (const pfad of QUELLEN.tsx) textAusTsx(readFileSync(pfad, 'utf8')).flatMap(saetze).forEach((s) => alle.add(s))

const sortiert = [...alle].sort((a, b) => a.localeCompare(b, 'de'))
writeFileSync(join(process.cwd(), 'content/legacy-sentences.json'), JSON.stringify(sortiert, null, 2) + '\n')
console.log(`${sortiert.length} Sätze nach content/legacy-sentences.json geschrieben`)
