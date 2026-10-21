'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { Color, LineBasicMaterial, MeshStandardMaterial, type Object3D } from 'three'
import { colors } from '@/lib/brand/tokens'
import { PART_NAMES, type PartName } from '@/scene/model/parts'
import { preloadComputer, useComputer } from '@/scene/loadComputer'

const HIGHLIGHT = 1.5
const BUTTON_CLASS =
  'w-full px-3 py-1 text-left font-mono text-[14px] text-muted hover:text-text disabled:opacity-40 aria-pressed:bg-surface aria-pressed:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
/** Geteilte Materialien ohne eigene Emission; die Hervorhebung fasst sie nie an. */
const SHARED_MATERIALS = new Set(['surface', 'case'])
const ACCENT_HEX = colors.accent.slice(1).toLowerCase()

preloadComputer()

function forEachMaterial(root: Object3D, visit: (material: unknown) => void) {
  root.traverse((object) => {
    const material = (object as Object3D & { material?: unknown }).material
    if (Array.isArray(material)) material.forEach(visit)
    else if (material) visit(material)
  })
}

/** Eigenes Emissionsmaterial eines Teils: Akzent als emissive, nicht eines der geteilten Materialien. */
function isOwnEmissive(material: unknown): material is MeshStandardMaterial {
  return (
    material instanceof MeshStandardMaterial &&
    !SHARED_MATERIALS.has(material.name) &&
    material.emissive.getHexString() === ACCENT_HEX
  )
}

/**
 * Setzt emissiveIntensity aller eigenen Emissionsmaterialien auf 0 und im Teilbaum des gewählten Teils auf 1.5.
 * Geteilte Materialien (surface, case) bleiben unberührt; gpu leuchtet daher ohne seine Lüfter.
 * Gehäuse, Seitenwand, Kühler, Lüfter und Netzteil haben kein eigenes Emissionsmaterial und zeigen keine Hervorhebung.
 */
function applyHighlight(scene: Object3D, traces: Object3D, selected: Object3D | null) {
  forEachMaterial(scene, (material) => {
    if (isOwnEmissive(material)) material.emissiveIntensity = 0
  })
  if (selected) {
    forEachMaterial(selected, (material) => {
      if (isOwnEmissive(material)) material.emissiveIntensity = HIGHLIGHT
    })
  }
  // traces (LineBasicMaterial, keine Emission): Akzent ohne Auswahl oder wenn gewählt, Gedimmt wenn ein anderes Teil gewählt ist
  const traceColor = new Color(selected && selected !== traces ? colors.muted : colors.accent)
  forEachMaterial(traces, (material) => {
    if (material instanceof LineBasicMaterial) material.color.copy(traceColor)
  })
}

function Computer({
  selected,
  sidePanel,
  onLoaded,
}: {
  selected: PartName | null
  sidePanel: boolean
  onLoaded: () => void
}) {
  const { scene, part } = useComputer()

  // Die Szene ist der geteilte glb-Cache (nicht geklont): jede Änderung wird beim Aufräumen zurückgesetzt,
  // damit spätere Nutzer von useComputer() eine unveränderte Szene bekommen.
  useEffect(() => {
    const panel = part('sidePanel')
    panel.visible = sidePanel
    return () => {
      panel.visible = true
    }
  }, [part, sidePanel])

  useEffect(() => {
    const traces = part('traces')
    applyHighlight(scene, traces, selected ? part(selected) : null)
    return () => applyHighlight(scene, traces, null)
  }, [scene, part, selected])

  // Abheben-Vorschau: bei gewählter CPU hebt der Kühler um 0.12 nach vorn (+z) ab
  useEffect(() => {
    if (selected !== 'cpu') return
    const cooler = part('cpuCooler')
    cooler.position.z += 0.12
    return () => {
      cooler.position.z -= 0.12
    }
  }, [part, selected])

  useEffect(onLoaded, [onLoaded])

  return <primitive object={scene} />
}

export default function ModelViewer() {
  const [selected, setSelected] = useState<PartName | null>(null)
  const [loaded, setLoaded] = useState(false)
  // In dieser Testansicht ist die Seitenwand standardmäßig ausgeblendet, damit das Innere sichtbar ist
  const [sidePanel, setSidePanel] = useState(false)
  const markLoaded = useCallback(() => setLoaded(true), [])

  return (
    <div data-loaded={loaded ? 'true' : 'false'} className="relative h-dvh w-full">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0.25, 0.2, 0.75], fov: 45, near: 0.01, far: 20 }}
      >
        <color attach="background" args={[colors.bg]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 2]} intensity={3} />
        <directionalLight position={[-2, 1, 1]} intensity={1.2} />
        <Suspense fallback={null}>
          <Computer selected={selected} sidePanel={sidePanel} onLoaded={markLoaded} />
        </Suspense>
        <OrbitControls makeDefault target={[0, 0, 0]} />
      </Canvas>
      <nav aria-label="Bauteile" className="absolute top-6 left-6 flex max-h-[calc(100dvh-3rem)] flex-col gap-4 overflow-y-auto">
        <button
          type="button"
          aria-pressed={sidePanel}
          disabled={!loaded}
          onClick={() => setSidePanel((visible) => !visible)}
          className={`${BUTTON_CLASS} border border-surface`}
        >
          Seitenwand
        </button>
        <ul aria-label="Teile" className="flex flex-col gap-1">
          {PART_NAMES.map((name) => (
            <li key={name}>
              <button
                type="button"
                aria-pressed={selected === name}
                disabled={!loaded}
                onClick={() => setSelected(name)}
                className={BUTTON_CLASS}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
