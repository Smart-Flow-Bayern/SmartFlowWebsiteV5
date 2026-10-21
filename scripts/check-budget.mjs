// Performance-Budget: JS gzip pro Route und Modellgröße. Aufruf nach `pnpm build`.
// Grenzen überschreibbar (nur zum Testen des Exit-Codes): BUDGET_JS_LIMIT, BUDGET_GLB_LIMIT.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

export const JS_LIMIT = 350_000
export const GLB_LIMIT = 3_000_000

/** Summe der gzip-Größen aller (eindeutigen) .js-Dateien. */
export function sumGzip(files, readFile) {
  const unique = [...new Set(files)].filter((f) => f.endsWith('.js'))
  return unique.reduce((sum, f) => sum + gzipSync(readFile(f)).length, 0)
}

const SCRIPT_TAG = /<script\b[^>]*>/g
const SRC = /src="\/_next\/(static\/chunks\/[^"?]+\.js)/

/** Skript-Pfade der HTML; nomodule-Polyfills laden moderne Browser nicht und zählen nicht. */
function htmlScripts(html) {
  return [...html.matchAll(SCRIPT_TAG)]
    .filter((m) => !/\bnoModule\b/i.test(m[0]))
    .map((m) => SRC.exec(m[0])?.[1])
    .filter(Boolean)
}

/**
 * Chunks einer Route: alle Skripte der vorgerenderten HTML-Seite (Initial-Last)
 * plus alle Chunks, die von diesen (transitiv) per Dateiname referenziert werden,
 * also auch lazy geladene wie die 3D-Szene mit Three.js.
 * Next 16 (Turbopack) schreibt kein app-build-manifest.json; die HTML ist die verlässliche Quelle.
 */
export function routeChunks(html, allChunks, readText) {
  const initial = new Set(htmlScripts(html))
  const total = new Set(initial)
  const queue = [...initial]
  while (queue.length) {
    const text = readText(queue.pop())
    for (const c of allChunks) {
      if (!total.has(c) && text.includes(c.split('/').pop())) {
        total.add(c)
        queue.push(c)
      }
    }
  }
  return { initial: [...initial], total: [...total] }
}

function main() {
  const root = process.cwd()
  const next = join(root, '.next')
  const jsLimit = Number(process.env.BUDGET_JS_LIMIT ?? JS_LIMIT)
  const glbLimit = Number(process.env.BUDGET_GLB_LIMIT ?? GLB_LIMIT)
  if (!existsSync(next)) {
    console.error('Kein .next-Ordner. Zuerst `pnpm build` ausführen.')
    process.exit(2)
  }
  const chunkDir = join(next, 'static', 'chunks')
  const allChunks = readdirSync(chunkDir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => `static/chunks/${f}`)
  const read = (f) => readFileSync(join(next, f))
  const readText = (f) => read(f).toString('utf8')

  const routes = { '/': 'index.html', '/en': 'en.html' }
  const rows = []
  let failed = false
  for (const [route, file] of Object.entries(routes)) {
    const html = readFileSync(join(next, 'server', 'app', file), 'utf8')
    const { initial, total } = routeChunks(html, allChunks, readText)
    const initialBytes = sumGzip(initial, read)
    const totalBytes = sumGzip(total, read)
    // Gated wird die Initial-Last (Semantik des früheren app-build-manifest: was die Route lädt).
    // Die Summe inkl. lazy geladener 3D-Szene wird zusätzlich ausgewiesen, ihr Überschreiten ist nur informativ.
    const ok = initialBytes <= jsLimit
    failed ||= !ok
    rows.push(`| JS ${route} (initial) | ${initialBytes} | ${jsLimit} | ${ok ? 'ok' : 'ÜBERSCHRITTEN'} |`)
    rows.push(
      `| JS ${route} (inkl. lazy 3D, nicht gated) | ${totalBytes} | ${jsLimit} | ${totalBytes <= jsLimit ? 'ok' : 'verfehlt (informativ)'} |`,
    )
  }
  const glb = statSync(join(root, 'public', 'models', 'computer.glb')).size
  const glbOk = glb <= glbLimit
  failed ||= !glbOk
  rows.push(`| computer.glb | ${glb} | ${glbLimit} | ${glbOk ? 'ok' : 'ÜBERSCHRITTEN'} |`)

  console.log('| Messgröße | Bytes (gzip bzw. roh bei glb) | Grenze | Status |')
  console.log('|---|---|---|---|')
  console.log(rows.join('\n'))
  if (failed) {
    console.error('Budget überschritten.')
    process.exit(1)
  }
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) main()
