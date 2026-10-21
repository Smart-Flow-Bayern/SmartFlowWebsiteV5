'use client'

import { useState } from 'react'
import { CONTACT } from '@/content/contact'
import { useContent } from '@/components/content/ContentProvider'

/** Click-to-load: vor dem Klick gibt es keinen Request an Cal.com. */
export function CalEmbed() {
  const content = useContent()
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="cal-embed">
      {loaded ? (
        <iframe
          className="cal-frame"
          src={`${CONTACT.calUrl}?embed=true&theme=dark`}
          title={content.contact.calTitle}
        />
      ) : (
        <>
          <button type="button" className="cal-button" onClick={() => setLoaded(true)}>
            {content.contact.calCta}
          </button>
          <p className="station-text">{content.contact.calConsent}</p>
        </>
      )}
      <a className="station-link" href={CONTACT.calUrl} target="_blank" rel="noopener noreferrer">
        {content.contact.calOpenNewTab}
      </a>
    </div>
  )
}
