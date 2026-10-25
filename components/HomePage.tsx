import { Footer } from '@/components/Footer'
import { ProcessStage } from '@/components/process/ProcessStage'
import { ProgressNav } from '@/components/nav/ProgressNav'
import { SiteNav } from '@/components/nav/SiteNav'
import { Scenes } from '@/components/scenes/Scenes'
import { ScrollProvider } from '@/components/scroll/ScrollProvider'
import { CONTENT } from '@/content'
import { buildYear } from '@/lib/build-year'

/** Startseite: Navigation, Sticky-Bühne mit Prozessgrafik und Szenen im Scrollbereich main.story (ohne Pin), Footer. */
export function HomePage() {
  const year = buildYear()
  return (
    <>
      {/* Erster Tab-Stop: Sprung zum Inhalt, danach die Navigation. */}
      <a className="skip-link" href="#main">
        {CONTENT.nav.skipLabel}
      </a>
      <SiteNav />
      <ProgressNav />
      <ScrollProvider>
        <main id="main" className="story" tabIndex={-1}>
          {/* Ziel des Wortmarken-Links #start ohne JS (Seitenanfang); mit JS löst ScrollProvider #start als Szene 01 auf. */}
          <div id="start" />
          <ProcessStage />
          <Scenes />
        </main>
      </ScrollProvider>
      <Footer year={year} />
    </>
  )
}
