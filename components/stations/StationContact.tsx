'use client'

import { CalEmbed } from '@/components/contact/CalEmbed'
import { Footer } from '@/components/Footer'
import { CONTACT } from '@/content/contact'
import { useContent } from '@/components/content/ContentProvider'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('kontakt')

export function StationContact() {
  const content = useContent()
  return (
    <StationOverlay id="kontakt" range={WINDOW} align="left" className="station-overlay--contact" scrollable>
      <div className="contact-info">
        <h2 id={titleId('kontakt')} className="station-title" tabIndex={-1}>
          {content.contact.title}
        </h2>
        <p className="station-intro">{content.contact.text}</p>
      </div>
      <div className="contact-cal">
        <CalEmbed />
      </div>
      <div className="contact-direct">
        <a className="station-link font-mono" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </a>
        <a className="station-link font-mono" href={CONTACT.phoneHref}>
          {CONTACT.phone}
        </a>
      </div>
      <Footer />
    </StationOverlay>
  )
}
