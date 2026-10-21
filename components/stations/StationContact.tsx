'use client'

import { CalEmbed } from '@/components/contact/CalEmbed'
import { Footer } from '@/components/Footer'
import { CONTACT } from '@/content/contact'
import { de } from '@/content/de'
import { stationWindow } from '@/scene/stations'
import { StationOverlay, titleId } from './StationOverlay'

const WINDOW = stationWindow('kontakt')

export function StationContact() {
  return (
    <StationOverlay id="kontakt" range={WINDOW} align="left" className="station-overlay--contact">
      <div className="contact-info">
        <h2 id={titleId('kontakt')} className="station-title" tabIndex={-1}>
          {de.contact.title}
        </h2>
        <p className="station-intro">{de.contact.text}</p>
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
