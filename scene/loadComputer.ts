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
  return reason instanceof Error && reason.message.startsWith(`Could not load ${COMPUTER_URL}`)
}

/**
 * Der GLTF-Loader wirft einen Ladefehler zusätzlich außerhalb von React (Rejection des Preload-Promises
 * ohne catch bzw. Fehler im Loader-Callback). Behandelt wird er über Suspense und SceneErrorBoundary
 * (Umschalten auf den statischen Modus); hier nur den doppelten, unbehandelten Fehler abfangen.
 * Gefiltert wird auf die Meldung des Loaders ("Could not load <url>"), nicht auf den Fehler aus part().
 * Die Listener leben bewusst für die gesamte Seitenlebensdauer; der Fehler wird einmal per console.warn protokolliert.
 */
function guardLoadErrors(): void {
  if (loadErrorGuard) return
  loadErrorGuard = true
  let logged = false
  const swallow = (event: Event, reason: unknown) => {
    if (!isComputerLoadError(reason)) return
    event.preventDefault()
    if (logged) return
    logged = true
    console.warn(reason)
  }
  window.addEventListener('unhandledrejection', (event) => swallow(event, event.reason))
  window.addEventListener('error', (event) => swallow(event, event.error))
}

export function preloadComputer(): void {
  guardLoadErrors()
  useGLTF.preload(COMPUTER_URL, USE_DRACO, USE_MESHOPT)
}
