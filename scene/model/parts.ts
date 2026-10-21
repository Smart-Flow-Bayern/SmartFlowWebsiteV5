import type { StationId } from '@/content/types'

/** Namen der Modellteile. Vertrag mit Szene und Animation (Tasks 9–16): Teile werden per Name gefunden. */
export const PART_NAMES = [
  'case',
  'sidePanel',
  'mainboard',
  'cpu',
  'cpuCooler',
  'ram_0',
  'ram_1',
  'ram_2',
  'ram_3',
  'gpu',
  'gpuFan_0',
  'gpuFan_1',
  'ssd',
  'psu',
  'ioPanel',
  'traces',
] as const

export type PartName = (typeof PART_NAMES)[number]

/** Teil, auf das die Kamera an einer Station schaut. */
export const STATION_PART: Record<StationId, PartName | null> = {
  gehaeuse: 'case',
  mainboard: 'mainboard',
  cpu: 'cpu',
  ram: 'ram_0',
  gpu: 'gpu',
  ssd: 'ssd',
  kontakt: 'ioPanel',
}

/** Teile mit Emissionsflächen (Akzentfarbe, Startintensität 0). */
export const EMISSIVE_PARTS: readonly PartName[] = [
  'cpu',
  'ram_0',
  'ram_1',
  'ram_2',
  'ram_3',
  'gpu',
  'ssd',
  'ioPanel',
  'traces',
  'mainboard',
]
