'use client'

import { useSyncExternalStore } from 'react'
import { CONTACT } from '@/content/contact'
import { useContent } from '@/components/content/ContentProvider'

const noopSubscribe = () => () => {}

/** Jahr erst auf dem Client lesen: new Date() im Prerender würde zur Build-Zeit eingefroren. */
function useYear(): number | null {
  return useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => null)
}

export function Footer() {
  const content = useContent()
  const year = useYear()
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
      <p className="font-mono">© {year} Smart Flow</p>
    </footer>
  )
}
