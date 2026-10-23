import { Analyse } from '@/components/scenes/Analyse'
import { Automatisierung } from '@/components/scenes/Automatisierung'
import { Komplexitaet } from '@/components/scenes/Komplexitaet'
import { Kontakt } from '@/components/scenes/Kontakt'
import { Struktur } from '@/components/scenes/Struktur'
import { Ueber } from '@/components/scenes/Ueber'
import { Wachstum } from '@/components/scenes/Wachstum'

/** Die sieben Szenen in Seitenreihenfolge (einzige Stelle, die die Reihenfolge kennt). */
export function Scenes() {
  return (
    <>
      <Komplexitaet />
      <Analyse />
      <Struktur />
      <Automatisierung />
      <Wachstum />
      <Ueber />
      <Kontakt />
    </>
  )
}
