import { Footer } from '@/components/Footer'
import { SiteNav } from '@/components/nav/SiteNav'
import { Scenes } from '@/components/scenes/Scenes'

/** Zwischenstand bis Task 5/6: Szenen als HTML, noch ohne Scroll-Treiber und Bühne. */
export function HomePage() {
  return (
    <>
      {/* Zuerst im DOM: Tab-Reihenfolge beginnt in der Navigation. */}
      <SiteNav />
      <main id="story" className="story">
        <Scenes />
      </main>
      <Footer />
    </>
  )
}
