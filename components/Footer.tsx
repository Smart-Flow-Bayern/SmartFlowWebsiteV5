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
  const other = content.locale === 'de' ? 'en' : 'de'
  return (
    <footer className="site-footer">
      <address className="font-mono">
        Smart Flow
        <br />
        {CONTACT.street}
        <br />
        {CONTACT.zip} {CONTACT.city}
      </address>
      <nav aria-label={content.footer.legalLabel} className="font-mono">
        {content.footer.legal.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <a href={content.footer.languageSwitch.href} hrefLang={other} lang={other}>
          {content.footer.languageSwitch.label}
        </a>
      </nav>
      <p className="font-mono">© {year} Smart Flow</p>
    </footer>
  )
}
