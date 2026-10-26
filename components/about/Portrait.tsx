import { PORTRAIT } from '@/lib/brand/portrait'

/** Ohne Foto bleibt die Stelle leer; der Initialen-Platzhalter ist vorübergehend entfernt. */
export function Portrait({ alt }: { alt: string }) {
  if (PORTRAIT === null) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="portrait" src={PORTRAIT.src} width={PORTRAIT.width} height={PORTRAIT.height} alt={alt} loading="lazy" />
  )
}
