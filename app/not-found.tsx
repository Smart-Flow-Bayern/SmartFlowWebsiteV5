import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Wordmark } from '@/components/brand/Wordmark'
import { CONTENT } from '@/content'
import { wordmarkVariant } from '@/lib/brand/tokens'

// noindex setzt Next für die 404 selbst.
export const metadata: Metadata = {
  title: 'Seite nicht gefunden – Smart Flow',
}

/** Unterbrochene Knotenkette: drei verbundene Knoten, eine Lücke, ein loser Knoten. */
function BrokenChain() {
  return (
    <svg className="nf-chain" viewBox="0 0 320 40" aria-hidden="true" focusable="false">
      <path d="M20 20H100M120 20H180" className="nf-edge" />
      <path d="M200 20H226" className="nf-edge" strokeDasharray="4 6" />
      {[20, 110, 190].map((x) => (
        <rect key={x} x={x - 9} y={11} width={18} height={18} className="nf-node" />
      ))}
      <rect x={281} y={11} width={18} height={18} className="nf-node" data-active="true" />
    </svg>
  )
}

/** 404 für alle unbekannten Adressen (Root-Layout liefert lang="de", Schriften und dunkles Thema). */
export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main">
        {CONTENT.nav.skipLabel}
      </a>
      <header className="nav-bar">
        <Link href="/" className="nav-link nav-brand" aria-label="Smart Flow – zur Startseite">
          <Wordmark variant={wordmarkVariant} size={24} decorative />
        </Link>
      </header>
      <main id="main" className="not-found" tabIndex={-1}>
        <p className="kicker">
          <b>404</b> Seite nicht gefunden
        </p>
        <BrokenChain />
        <h1>Hier reißt der Ablauf ab.</h1>
        <div className="prose">
          <p>Diese Adresse gibt es auf smartflow.bayern nicht oder nicht mehr. Auf der Startseite geht es weiter.</p>
        </div>
        <Link className="btn" href="/">
          Zurück zu Smart Flow
        </Link>
      </main>
      <Footer />
    </>
  )
}
