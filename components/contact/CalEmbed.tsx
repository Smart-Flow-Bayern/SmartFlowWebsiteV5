'use client'

import { useState } from 'react'
import { CONTACT } from '@/content/contact'
import { useContent } from '@/components/content/ContentProvider'

/** Click-to-load: vor dem Klick gibt es keinen Request an Cal.com. */
export function CalEmbed() {
  const kontakt = useContent().scenes.kontakt
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="cal-embed">
      {loaded ? (
        <div className="cal-frame" data-lenis-prevent>
          <iframe src={`${CONTACT.calUrl}?embed=true&theme=dark`} title={kontakt.calTitle} />
        </div>
      ) : (
        <>
          <button type="button" className="cal-button" onClick={() => setLoaded(true)}>
            {kontakt.calCta}
          </button>
          <p className="station-text">{kontakt.calConsent}</p>
        </>
      )}
      <a className="station-link" href={CONTACT.calUrl} target="_blank" rel="noopener noreferrer">
        {kontakt.calOpenNewTab}
      </a>
    </div>
  )
}
