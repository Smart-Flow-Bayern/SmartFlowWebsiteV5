'use client'

import { useState } from 'react'
import { CONTACT } from '@/content/contact'
import { de } from '@/content/de'

/** Click-to-load: vor dem Klick gibt es keinen Request an Cal.com. */
export function CalEmbed() {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="cal-embed">
      {loaded ? (
        <iframe
          className="cal-frame"
          src={`${CONTACT.calUrl}?embed=true&theme=dark`}
          title="Terminbuchung bei Cal.com"
        />
      ) : (
        <>
          <button type="button" className="cal-button" onClick={() => setLoaded(true)}>
            {de.contact.calCta}
          </button>
          <p className="station-text">{de.contact.calConsent}</p>
        </>
      )}
      <a className="station-link" href={CONTACT.calUrl} target="_blank" rel="noopener noreferrer">
        Kalender in neuem Tab öffnen
      </a>
    </div>
  )
}
