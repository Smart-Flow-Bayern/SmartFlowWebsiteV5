// Exportiert buildComputer() als public/models/computer.glb (Meshopt-komprimiert). Neu erzeugen: pnpm model:export
import { execFileSync } from 'node:child_process'
import { rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { buildComputer } from '../scene/model/buildComputer.ts'

// Node hat kein FileReader; GLTFExporter braucht für binary: true nur readAsArrayBuffer mit onloadend
globalThis.FileReader ??= class {
  result: ArrayBuffer | null = null
  onloadend: (() => void) | null = null
  readAsArrayBuffer(blob: Blob) {
    void blob.arrayBuffer().then((buffer) => {
      this.result = buffer
      this.onloadend?.()
    })
  }
} as unknown as typeof FileReader

const root = process.cwd()
const raw = join(root, 'public/models/computer.raw.glb')
const out = join(root, 'public/models/computer.glb')

const glb = await new GLTFExporter().parseAsync(buildComputer(), { binary: true })
writeFileSync(raw, Buffer.from(glb as ArrayBuffer))
try {
  execFileSync('pnpm', ['exec', 'gltf-transform', 'meshopt', raw, out], { stdio: 'inherit' })
} finally {
  rmSync(raw, { force: true })
}

console.log(`public/models/computer.glb geschrieben: ${statSync(out).size} Bytes`)
