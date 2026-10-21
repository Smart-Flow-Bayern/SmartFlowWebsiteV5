import { useGLTF } from '@react-three/drei'
import { useCallback } from 'react'
import type { Group, Object3D } from 'three'
import type { PartName } from './model/parts'

export const COMPUTER_URL = '/models/computer.glb'

// drei 10: useGLTF(path, useDraco, useMeshopt). Kein Draco (das Modell ist Meshopt-komprimiert, der
// Draco-Decoder käme sonst vom CDN), Meshopt-Decoder aus three-stdlib (eingebettet, kein externer Abruf).
const USE_DRACO = false
const USE_MESHOPT = true

/** Lädt das Computermodell (suspendiert bis geladen). `part` findet auch verschachtelte Teile. */
export function useComputer(): { scene: Group; part(name: PartName): Object3D } {
  const { scene } = useGLTF(COMPUTER_URL, USE_DRACO, USE_MESHOPT)
  const part = useCallback(
    (name: PartName) => {
      const found = scene.getObjectByName(name)
      if (!found) throw new Error(`Modellteil „${name}“ fehlt in ${COMPUTER_URL}`)
      return found
    },
    [scene],
  )
  return { scene, part }
}

let loadErrorGuard = false

function isComputerLoadError(reason: unknown): boolean {
  return reason instanceof Error && reason.message.includes(COMPUTER_URL)
}

/**
 * Der GLTF-Loader wirft einen Ladefehler zusätzlich außerhalb von React (Rejection des Preload-Promises
 * ohne catch bzw. Fehler im Loader-Callback). Behandelt wird er über Suspense und SceneErrorBoundary
 * (Umschalten auf den statischen Modus); hier nur den doppelten, unbehandelten Fehler abfangen.
 */
function guardLoadErrors(): void {
  if (loadErrorGuard) return
  loadErrorGuard = true
  window.addEventListener('unhandledrejection', (event) => {
    if (isComputerLoadError(event.reason)) event.preventDefault()
  })
  window.addEventListener('error', (event) => {
    if (isComputerLoadError(event.error)) event.preventDefault()
  })
}

export function preloadComputer(): void {
  guardLoadErrors()
  useGLTF.preload(COMPUTER_URL, USE_DRACO, USE_MESHOPT)
}
