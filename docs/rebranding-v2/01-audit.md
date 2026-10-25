# Rebranding Master-Prompt V2 – Phase 01: Audit

Stand: 2026-10-23. Grundlage: `SmartFlow_Website_Rebranding_MasterPrompt_V2.json` (Leon, 2026-10-23) gegen den Stand von `SmartFlowWebsiteV5` (Commit `77f5b0a`).

Zweck: Vor Konzept und Umbau festhalten, was es gibt, was der neue Prompt verlangt und wo beides auseinanderläuft. Die Entscheidungen in Abschnitt 6 müssen von Leon kommen, bevor Phase 02 (drei Designrichtungen) sinnvoll ist.

---

## 1. Projektstruktur und Stack (Ist)

| Bereich | Stand |
|---|---|
| Framework | Next.js 16.4.2 (App Router, Turbopack), React 19.3, TypeScript 5, Tailwind 4 |
| Animation | GSAP 3.15 mit ScrollTrigger (Scroll-Kopplung), Lenis 1.3 (weiches Scrollen) |
| 3D | three 0.186, @react-three/fiber 9, @react-three/drei 10; Modell prozedural aus `scene/model/buildComputer.ts`, exportiert als `public/models/computer.glb` (131 kB, Meshopt) |
| Tests | Vitest 5 (26 Dateien, 163 Tests, grün am 2026-10-23), Playwright (64 E2E-Tests Chromium und Firefox, laut Checkliste grün am 2026-10-21) |
| Qualitätswerkzeuge | `pnpm budget` (JS- und Modellgrenze), Lighthouse CI (mobil und Desktop), `pnpm check:csp`, `pnpm measure:frames` |
| Sprachen | Deutsch unter `/`, Englisch unter `/en`, hreflang-Alternates |
| Hosting | Vercel vorbereitet (`vercel.json`, Doku unter `docs/deploy/`), kein Deployment, Domain liegt noch auf GitHub Pages (v3) |
| Remote | `github.com/Smart-Flow-Bayern/SmartFlowWebsiteV5`, Branch `main`, Arbeitsbaum sauber |

Code-Umfang (ohne Rechtstexte): rund 8 400 Zeilen inklusive Tests. Größte Dateien: `app/globals.css` (627), `scene/model/buildComputer.ts` (299), `components/scene/Computer.tsx` (196).

### Architektur

Drei Ebenen, sauber getrennt, wie der Master-Prompt es fordert:

- **Inhalt:** `content/de.ts`, `content/en.ts`, typisiert über `content/types.ts`; Floskel-Sperrliste in `content/floskeln.ts` mit Tests.
- **Darstellung:** `components/stations/*` (HTML-Overlays je Station), `components/nav/SiteNav.tsx`, `components/static/StaticStations.tsx` (Standbild-Fallback), `components/Footer.tsx`, `components/contact/CalEmbed.tsx`.
- **Animation:** `components/scroll/ScrollProvider.tsx` liefert einen Fortschritt 0 bis 1 über zehn Bildschirmhöhen; reine Funktionen in `scene/camera.ts`, `scene/lighting.ts`, `scene/stations.ts`, `lib/scroll/visibility.ts` leiten daraus Kamerapose, Licht, aktives Bauteil und sichtbare Overlays ab.

Das Zustandsmodell „Scrollposition steuert Zustände“ existiert also bereits, nur mit anderen Zuständen (Bauteile statt Prozessphasen).

### Fallbacks

- `prefers-reduced-motion`: keine Kamerafahrt, vorgerenderte Standbilder je Station (`public/stations/*.webp`, Desktop und mobil).
- Statischer Modus bei fehlendem WebGL2, `deviceMemory` ≤ 2 GB oder `Save-Data`.
- Alle Texte sind echtes HTML, nie in WebGL gerendert.

## 2. Asset-Inventur

| Asset | Pfad | Anmerkung |
|---|---|---|
| Wortmarke „Signal“, 2 Varianten | `public/brand/wordmark-underscore.svg`, `wordmark-impulse.svg` | Auswahl durch Leon laut Spec noch offen |
| Bildmarke Impuls | `public/brand/impulse.svg` | Basis für Favicon, Apple-Touch-Icon, OG-Bild |
| Fonts lokal | `public/fonts/schibsted-grotesk-latin-wght.woff2` (47 kB), `jetbrains-mono-latin-wght.woff2` (40 kB) | keine Google-Fonts-Abrufe |
| 3D-Modell | `public/models/computer.glb` | 131 kB |
| Standbilder | `public/stations/station-0..6(-mobile).webp` | 3,5 bis 52 kB |
| Rechtstexte | `public/impressum.html`, `datenschutz.html`, `agb.html`, `public/en/*` | Hosting-Abschnitt noch ohne Anbieter, siehe `docs/content/rechtstexte-offen.md` |
| Altes Logo | `/Users/leon/Documents/Buisness/Smart Flow/Branding/Logos/final_logo_set/` | Türkis-Wellen im Kreis, Wortmarke „Smart Flow“, Claim „Digitale Prozesse. Reale Entlastung.“ |

**Nicht gefunden:** ein „SF-Logo“ oder Monogramm, wie der Master-Prompt es als beizubehalten nennt. Weder im Business-Ordner noch in v3, V4 oder V5. Ebenso wenig der Claim „Structure. Automation. Growth.“ oder der Satz „We turn complexity into intelligent systems.“ (gesucht in v3, V4, V5 und im Business-Ordner).

## 3. Content, SEO, Performance (Ist)

**Content.** Sieben Stationen (Start, Überblick, Abläufe, Werkzeuge, Automatisch, Vorgehen, Kontakt) plus „Über“-Einblendung. Zielgruppe im Text: Handwerk, Praxis, Hausverwaltung. Sie-Form, Floskel-Prüfung per Test. Alle 28 Fragen des Fakten-Briefings sind offen, daher keine Zahlen, keine Dauern, keine Referenzen.

**SEO.** Metadaten, OG-Bild (`app/opengraph-image.tsx`), JSON-LD LocalBusiness, Service und Person (`lib/seo/schema.ts`), Sitemap, robots, hreflang. Lighthouse SEO 100. Offene Schema-Felder in `docs/content/seo-offen.md`.

**Performance** (aus `docs/performance/2026-10-messung.md`, lokal, keine Preview):

| Metrik | Ziel | Wert |
|---|---|---|
| Initial-JS gzip | < 350 kB | 196 kB |
| JS inklusive lazy 3D | < 350 kB (Spec) | 464 kB, verfehlt |
| Lighthouse mobil, echte GPU | ≥ 70 | 93 |
| Lighthouse mobil, SwiftShader | ≥ 70 | 50, verfehlt |
| Lighthouse Desktop, echte GPU | ≥ 90 | 100 |
| Accessibility, Best Practices, SEO | ≥ 95 | 100 |
| Frame-Dauer p95 | ≤ 33 ms | 17,5 ms |

Einordnung: Mit GPU erfüllt die Seite alle Ziele. Der Software-Renderer-Wert und das Gesamt-JS zeigen, dass Three.js der Kostenfaktor ist. Der Master-Prompt verlangt „WebGL/Three.js nur bei klarem Mehrwert gegenüber SVG oder DOM“. Das ist der zentrale technische Hebel in Abschnitt 5.

## 4. Skill-Inventur

Geprüft: `/Users/leon/Documents/GitHub/skills` (zwei Skills) und die in dieser Sitzung installierten Skills.

| Skill | Was er kann | Einsatz je Phase |
|---|---|---|
| `awwwards` (skills-Repo) | Brief, drei Konzepte, Art Direction als `DESIGN.md`, Build mit GSAP/Lenis, QA-Schleife im echten Browser mit „blindem“ Kritiker. Referenzen zu Motion (gepinnte Scroll-Timelines, Chapter-States), Typografie, Layout, Next.js-Adapter, WebGL (OGL, Three.js nur für echtes 3D, kein R3F). Scripts: `audit.mjs`, `shoot.mjs`, `font.mjs`, `og.mjs`. | Konzept (02), Storyboard (03), Design-System (04), Implementierung (05), QA (06) |
| `jury` (skills-Repo) | Bewertet eine URL oder einen lokalen Build wie eine Awwwards-Jury: Screenshots Desktop, gedrosseltes Phone, Reduced Motion, Tastatur, Hover; misst LCP, CLS, FPS, axe; Scorecard mit Fix-Liste. | Audit (01, Ist-Score von V5), QA (06), Delivery (07, Re-Score) |
| `geo` plus Agenten `geo-technical`, `geo-schema`, `geo-content` (installiert) | GEO/SEO-Audit, Schema-Prüfung, llms.txt, Crawlbarkeit, E-E-A-T | QA (06), Delivery (07) |
| `dataviz` (installiert) | Regeln für Diagramme und Statuskacheln | Szene 05 „Growth“, Nutzenfelder ohne erfundene Zahlen |
| `code-review`, `security-review`, `simplify` (installiert) | Review der Änderungen | QA (06) |
| `run` (installiert) | App starten und Screenshots für Sichtprüfung | Implementierung (05), QA (06) |

Voraussetzungen für `awwwards`/`jury`: Node 20+, Playwright und axe-core (installieren sich selbst), Chromium. Keine API-Keys. `font.mjs` und `photos.mjs` greifen auf externe Dienste zu und werden nicht gebraucht (Fonts liegen lokal, keine Fotos). Es gibt keinen Skill für Logo- oder Markenentwurf; die Spec nennt `brandkit`, der in dieser Umgebung nicht installiert ist.

Noch nicht ausgeführt: `jury` gegen den aktuellen V5-Build. Empfehlung: als Ist-Score vor dem Umbau laufen lassen, sobald die Richtung feststeht.

## 5. Abgleich Master-Prompt V2 gegen V5

| Thema | Master-Prompt V2 | V5 (Stand) | Grad der Abweichung |
|---|---|---|---|
| Kernkonzept | Eine durchgehende Prozessvisualisierung (Nodes, Verbindungen) in sechs Zuständen: Complexity, Analysis, Structure, Automation, Growth, Conversion | Kamerafahrt durch einen stilisierten Computer in sieben Stationen (Gehäuse, Mainboard, CPU, RAM, GPU, SSD, Anschlussleiste) | grundlegend |
| Marke | Vorhandenes SF-Logo/Monogramm und Claim „Structure. Automation. Growth.“ beibehalten, neue digitale Designsprache ohne Corporate-Rebranding | Marke „Signal“ komplett neu: Wortmarke `smart_flow`, Impuls-Bildmarke, Akzent `#DDFF4D`, Schibsted Grotesk + JetBrains Mono. Altes Logo (Türkis-Wellen) ersetzt. | grundlegend, und das genannte SF-Monogramm existiert nirgends |
| Claim | „Structure. Automation. Growth.“, Positionierung „We turn complexity into intelligent systems.“ (Englisch) | „Weniger Lärm. Mehr erledigt.“ (Deutsch, Sie-Form, Zielgruppe Handwerk/Praxis/Hausverwaltung) | neu; Englisch auf der deutschen Seite widerspricht dem bisherigen Tonfall |
| Leistungen | KI-gestützte Prozessoptimierung, Workflow-Automatisierung, Individuelle Softwareentwicklung, KI-Agenten und Multi-Agent-Orchestrierung, Strategische Digitalisierung | Prozessoptimierung, Digitalisierung, Automatisierung; Vorgehen in vier Schritten | teilweise; Softwareentwicklung und KI-Agenten fehlen in V5 |
| Technik | SVG/DOM bevorzugt, WebGL nur bei klarem Mehrwert, einheitliche Animationsarchitektur | Three.js/R3F für das Modell, GSAP für Scroll, Lenis | V5 verstößt gegen die Präferenz, erfüllt aber die Messziele mit GPU |
| Informationsarchitektur | Startseite als Prozessgeschichte plus Leistungen, Anwendungsfälle, Arbeitsweise, Vertrauen, Kontakt, Rechtliches | Eine lange Startseite, Rechtsseiten; Unterseiten sind explizit Nicht-Ziel der V5-Spec | mittel; kann als Abschnitte oder als Unterseiten gelöst werden |
| Fallbacks, A11y, SEO, i18n | gefordert | vorhanden, getestet | passt, übernehmbar |
| Keine erfundenen Zahlen | gefordert | eingehalten, Briefing offen | passt |
| Mobile | eigenständig konzipieren, Komplexität reduzieren | Quality-Tiers, Standbilder, 320-px-Test | passt |

### Was aus V5 unabhängig vom Konzept wiederverwendbar ist

- Next.js-Grundgerüst, Tailwind-Tokens, lokale Fonts, Security-Header und CSP, Rechtstexte, Cal.com nach Klick, Footer.
- ScrollProvider mit Fortschritt 0 bis 1 und die Idee „reine Funktionen leiten Zustand aus Fortschritt ab“.
- Station-Overlay-Mechanik, Navigation mit Deep-Links und Tastaturbedienung, Reduced-Motion- und Static-Mode-Weiche.
- Content-Typisierung, Floskel-Prüfung, SEO-Schema, Sitemap, i18n-Struktur.
- Test- und Messinfrastruktur (Vitest, Playwright, Budget, Lighthouse, CSP, Frame-Messung).

### Was bei vollem Umstieg auf den V2-Prompt entfällt

- Modell, Szene, Kamerapfad, Licht-Dramaturgie (`scene/*`, `components/scene/*`, `public/models/`, `public/stations/`), rund 1 200 Zeilen plus Tests.
- Die sieben Stationstexte in ihrer Bauteil-Metapher (Texte selbst sind teils übertragbar).

## 6. Stärken, Schwächen, Entscheidungen

**Stärken V5:** fertige, getestete Infrastruktur; alle Messziele mit GPU erreicht; saubere Trennung Inhalt/Darstellung/Animation; Tonfall konkret und floskelfrei; i18n und Fallbacks fertig.

**Schwächen V5 gemessen am V2-Prompt:** Computer-Metapher erzählt „Lärm filtern“, nicht „Komplexität in Systeme verwandeln“; Three.js-Last (464 kB gesamt, Software-Renderer bei 50); kein Nutzen-Abschnitt („Growth“); keine eigenen Leistungsseiten; Softwareentwicklung und KI-Agenten tauchen nicht auf.

**Schwächen des V2-Prompts gemessen an der Realität:** nennt ein Logo und einen Claim, die es nicht gibt; englische Positionierung passt nicht zur deutschen Zielgruppe; „fünf Leistungen“ sind breiter als der bisherige Fokus auf kleine Betriebe.

### Entscheidungen für Leon (blockierend für Phase 02)

1. **Konzept:** V5-Computer-Tauchgang durch die sechsstufige Prozessgeschichte ersetzen (Prompt V2 wörtlich), oder die Prozessgeschichte in die vorhandene Szene einbauen (Hybrid), oder V5 fertigstellen und V2 verwerfen?
2. **Marke:** Welches Logo ist „vorhanden“ und bleibt: die Signal-Wortmarke aus V5, das alte Türkis-Wellen-Logo, oder ein SF-Monogramm, das noch geliefert wird?
3. **Claim und Sprache:** „Structure. Automation. Growth.“ ersetzt „Weniger Lärm. Mehr erledigt.“? Englischer Claim auch auf der deutschen Seite?
4. **Leistungen:** Die fünf Leistungen aus dem Prompt übernehmen (inklusive Softwareentwicklung, KI-Agenten, Multi-Agent-Orchestrierung) oder beim Dreiklang Prozesse, Werkzeuge, Automatisierung für Handwerk, Praxis, Hausverwaltung bleiben?
5. **Technik:** Three.js behalten oder gemäß Prompt auf SVG/DOM/Canvas 2D wechseln? Die Prozessgrafik (Nodes, Verbindungen, Datenpakete) ist in SVG gut machbar und würde das Gesamt-JS um rund 265 kB senken.
6. **Unterseiten:** Leistungen, Anwendungsfälle, Arbeitsweise als eigene Seiten (Prompt) oder als Abschnitte der Startseite (V5-Spec)?

### Empfehlung

Prompt V2 als neue Leitlinie annehmen, aber auf der V5-Infrastruktur: Szene und Modell durch eine SVG-Prozessvisualisierung in sechs Zuständen ersetzen, Signal-Marke (Farben, Schrift, Wortmarke) beibehalten, Claim nur dann wechseln, wenn Leon ihn bestätigt, deutscher Tonfall bleibt. Three.js fällt weg. Das erfüllt die Technikvorgabe des Prompts, senkt die Last deutlich und bewahrt Tests, i18n, Fallbacks und SEO. Phase 02 liefert dann drei Richtungen innerhalb dieses Rahmens.
