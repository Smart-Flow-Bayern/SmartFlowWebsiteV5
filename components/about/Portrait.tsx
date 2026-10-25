import { PORTRAIT } from '@/lib/brand/portrait'

export function Portrait({ initials, alt }: { initials: string; alt: string }) {
  if (PORTRAIT === null) {
    return (
      <div className="portrait" role="img" aria-label={alt}>
        <span aria-hidden>{initials}</span>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="portrait" src={PORTRAIT.src} width={PORTRAIT.width} height={PORTRAIT.height} alt={alt} loading="lazy" />
  )
}
