import { Footer } from '@/components/Footer'
import { ProcessStage } from '@/components/process/ProcessStage'
import { ProgressNav } from '@/components/nav/ProgressNav'
import { SiteNav } from '@/components/nav/SiteNav'
import { Scenes } from '@/components/scenes/Scenes'
import { ScrollProvider } from '@/components/scroll/ScrollProvider'

/** Startseite: Navigation, Sticky-Bühne mit Prozessgrafik und Szenen im Scrollbereich #story (ohne Pin), Footer. */
export function HomePage() {
  return (
    <>
      {/* Zuerst im DOM: Tab-Reihenfolge beginnt in der Navigation. */}
      <SiteNav />
      <ProgressNav />
      <ScrollProvider>
        <main id="story" className="story">
          <ProcessStage />
          <Scenes />
        </main>
      </ScrollProvider>
      <Footer />
    </>
  )
}
