import type { Metadata } from 'next'
import Link from 'next/link'

// Die englische Fassung gibt es nicht mehr. GitHub Pages kennt keine Server-Weiterleitung, deshalb
// <meta refresh> (React setzt das Tag in den <head>) und ein Link für den Fall, dass sie nicht greift.
export const metadata: Metadata = {
  title: 'Smart Flow',
  robots: { index: false },
  alternates: { canonical: '/' },
}

export default function English() {
  return (
    <main className="p-8">
      <meta httpEquiv="refresh" content="0; url=/" />
      <p>
        <Link href="/">Weiter zur Startseite</Link>
      </p>
    </main>
  )
}
