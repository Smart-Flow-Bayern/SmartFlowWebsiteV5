import { revealIndex } from '@/lib/scroll/visibility'
import { easeInOutCubic } from './camera'
import { localProgress, stationWindow } from './stations'

const MAINBOARD = stationWindow('mainboard')
const CPU = stationWindow('cpu')
const RAM = stationWindow('ram')
const GPU = stationWindow('gpu')
const SSD = stationWindow('ssd')
const KONTAKT = stationWindow('kontakt')

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const inWindow = (p: number, w: { start: number; end: number }) => p >= w.start && p < w.end
/** Anteil des Fensters, über den eine Einlaufbewegung läuft. */
const FIRST_THIRD = 1 / 3

const PANEL_FROM = 0.06
const PANEL_TO = 0.14
const PANEL_DISTANCE = 0.35
const FAN_MAX_SPEED = 18
/** Mainboard-Fenster: Impuls läuft dort dreimal so schnell wie sonst. */
const IMPULSE_BOOST = 3
const IMPULSE_CYCLES = 6

/** Verschiebung der Seitenwand in +x (Meter). */
export function sidePanelOffset(progress: number): number {
  return PANEL_DISTANCE * easeInOutCubic(clamp01((progress - PANEL_FROM) / (PANEL_TO - PANEL_FROM)))
}

/** Index des Bauteils, das gerade aufleuchtet (cpu, ram_0, gpu, ssd, ioPanel), -1 außerhalb des Mainboard-Fensters. */
export function mainboardLabelIndex(progress: number): number {
  if (!inWindow(progress, MAINBOARD)) return -1
  return revealIndex(progress, MAINBOARD, 5) - 1
}

/**
 * Lüfterdrehzahl in rad/s: 0 außerhalb der GPU-Station, im ersten Fensterdrittel linear von 0 auf 18,
 * danach 18. Der Winkel wird pro Frame aus der Drehzahl integriert (siehe Computer.tsx), damit er nie springt.
 */
export function fanSpeed(progress: number): number {
  if (!inWindow(progress, GPU)) return 0
  return FAN_MAX_SPEED * clamp01(localProgress(progress, GPU) / FIRST_THIRD)
}

/** Anzahl der beschriebenen SSD-Blöcke, 0 bis 4. */
export function ssdBlocksWritten(progress: number): number {
  return inWindow(progress, SSD) ? revealIndex(progress, SSD, 4) : 0
}

/** Position 0 bis <1 des Lichtpunkts entlang der Leiterbahn; läuft stetig, am Mainboard schneller. */
export function traceImpulse(progress: number): number {
  const inBoard = Math.min(Math.max(progress, MAINBOARD.start), MAINBOARD.end) - MAINBOARD.start
  const phase = IMPULSE_CYCLES * (progress + (IMPULSE_BOOST - 1) * inBoard)
  return phase - Math.floor(phase)
}

/** Einstecken des Kabels: 0 außerhalb der Kontakt-Station, 1 nach dem ersten Fensterdrittel. */
export function cableInsert(progress: number): number {
  if (!inWindow(progress, KONTAKT)) return 0
  return clamp01(localProgress(progress, KONTAKT) / FIRST_THIRD)
}

/** Kühler-Abhebung: 0 bis 1 im ersten Drittel der CPU-Station, dort bleibend, im ersten Drittel der RAM-Station zurück auf 0. */
export function coolerLift(progress: number): number {
  if (inWindow(progress, CPU)) return easeInOutCubic(clamp01(localProgress(progress, CPU) / FIRST_THIRD))
  if (inWindow(progress, RAM)) return 1 - easeInOutCubic(clamp01(localProgress(progress, RAM) / FIRST_THIRD))
  return 0
}
