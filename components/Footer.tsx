'use client'

import { useSyncExternalStore } from 'react'
import { CONTACT } from '@/content/contact'
import { useContent } from '@/components/content/ContentProvider'

const noopSubscribe = () => () => {}

/**
 * Server und Hydration: `serverYear` (Build-Jahr aus dem Server-Render, siehe lib/build-year.ts), damit das Jahr auch ohne
 * JavaScript dasteht. Danach das aktuelle Jahr des Clients (falls der Build aus dem Vorjahr stammt).
 */
function useYear(serverYear: number | undefined): number | undefined {
  return useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => serverYear)
}

export function Footer({ year: serverYear }: { year?: number }) {
  const content = useContent()
  const year = useYear(serverYear)
  return (
    <footer className="site-footer">
      <address className="font-mono">
        Smart Flow
        <br />
        {CONTACT.street}
        <br />
        {CONTACT.zip} {CONTACT.city}
        <br />
        <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
        <br />
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </address>
      <nav aria-label={content.footer.legalLabel} className="font-mono">
        {content.footer.legal.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <p className="font-mono">{year === undefined ? '© Smart Flow' : `© ${year} Smart Flow`}</p>
    </footer>
  )
}
