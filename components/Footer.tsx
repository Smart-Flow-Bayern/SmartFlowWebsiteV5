'use client'

import { useSyncExternalStore } from 'react'
import { CONTACT } from '@/content/contact'
import { de } from '@/content/de'

const noopSubscribe = () => () => {}

/** Jahr erst auf dem Client lesen: new Date() im Prerender würde zur Build-Zeit eingefroren. */
function useYear(): number | null {
  return useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => null)
}

export function Footer() {
  const year = useYear()
  return (
    <footer className="site-footer">
      <address className="font-mono">
        Smart Flow
        <br />
        {CONTACT.street}
        <br />
        {CONTACT.zip} {CONTACT.city}
      </address>
      <nav aria-label="Rechtliches" className="font-mono">
        {de.footer.legal.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <a href={de.footer.languageSwitch.href} hrefLang="en" lang="en">
          {de.footer.languageSwitch.label}
        </a>
      </nav>
      <p className="font-mono">© {year} Smart Flow</p>
    </footer>
  )
}
