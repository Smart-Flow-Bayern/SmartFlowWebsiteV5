import { Footer } from '@/components/Footer'
import { ProgressNav } from '@/components/nav/ProgressNav'
import { SiteNav } from '@/components/nav/SiteNav'
import { Scenes } from '@/components/scenes/Scenes'
import { ScrollProvider } from '@/components/scroll/ScrollProvider'

/** Startseite: Navigation, Szenen im Scrollbereich #story (ScrollTrigger ohne Pin), Footer. */
export function HomePage() {
  return (
    <>
      {/* Zuerst im DOM: Tab-Reihenfolge beginnt in der Navigation. */}
      <SiteNav />
      <ProgressNav />
      <ScrollProvider>
        <main id="story" className="story">
          <Scenes />
        </main>
      </ScrollProvider>
      <Footer />
    </>
  )
}
