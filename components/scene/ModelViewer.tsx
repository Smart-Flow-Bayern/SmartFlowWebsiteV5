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
  'w-full px-3 py-1 text-left font-mono text-[14px] text-muted hover:text-text disabled:opacity-40 aria-pressed:bg-surface aria-pressed:text-accent'

preloadComputer()

function forEachMaterial(root: Object3D, visit: (material: unknown) => void) {
  root.traverse((object) => {
    const material = (object as Object3D & { material?: unknown }).material
    if (Array.isArray(material)) material.forEach(visit)
    else if (material) visit(material)
  })
}

/**
 * Setzt emissiveIntensity aller MeshStandardMaterials auf 0 und im Teilbaum des gewählten Teils auf 1.5.
 * Hinweis: Gehäuse, Kühler, Lüfter und Netzteil teilen Materialien ohne Emissionsfarbe; dort ist die
 * Hervorhebung unsichtbar.
 */
function applyHighlight(scene: Object3D, traces: Object3D, selected: Object3D | null) {
  forEachMaterial(scene, (material) => {
    if (material instanceof MeshStandardMaterial) material.emissiveIntensity = 0
  })
  if (selected) {
    forEachMaterial(selected, (material) => {
      if (material instanceof MeshStandardMaterial) material.emissiveIntensity = HIGHLIGHT
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

  useEffect(() => {
    part('sidePanel').visible = sidePanel
  }, [part, sidePanel])

  useEffect(() => {
    applyHighlight(scene, part('traces'), selected ? part(selected) : null)
  }, [scene, part, selected])

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
      <nav className="absolute top-6 left-6 flex max-h-[calc(100dvh-3rem)] flex-col gap-4 overflow-y-auto">
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
