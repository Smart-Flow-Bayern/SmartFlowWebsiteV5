# Smart Flow Website V5

Neue Unternehmenswebsite von Smart Flow (smartflow.bayern): eine Scroll-Fahrt entlang einer SVG-Prozessgrafik, alle Texte als echtes HTML, nur Deutsch (`/en` leitet dauerhaft auf die Startseite).

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- GSAP (ScrollTrigger) und Lenis für die Scroll-Animation der SVG-Prozessgrafik
- Vitest und Testing Library (Unit-Tests), Playwright (E2E)
- pnpm

## Befehle

| Befehl | Zweck |
|---|---|
| `pnpm dev` | Entwicklungsserver |
| `pnpm build` | Produktions-Build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript-Prüfung |
| `pnpm test` | Unit-Tests (Vitest) |
| `pnpm test:watch` | Vitest im Watch-Modus |
| `pnpm budget` | Prüft das JS-Budget der Startseite (220 000 Bytes gzip, nach `pnpm build`) |
| `pnpm e2e` | E2E-Tests (Playwright, Chromium und Firefox, startet den Dev-Server auf Port 3005) |
| `pnpm check:csp` | Prüft die Content-Security-Policy gegen den Production-Build (`pnpm start -p 3006` muss laufen) |

Einmalig vor dem ersten E2E-Lauf: `pnpm exec playwright install chromium firefox`.

## Prozessgrafik

Die Startseite zeigt eine SVG-Prozessgrafik statt einer 3D-Szene (kein Three.js, keine Modell-Pipeline). Code: `scene/process/*`, eingebunden über `components/process/ProcessStage.tsx`.

Platzhalter, die noch ersetzt werden müssen:

- Logo: Wortmarke in `components/brand/Wordmark.tsx`
- Akzentfarbe: eine CSS-Variable plus `colors.accent` in `lib/brand/tokens.ts`
- Foto: `lib/brand/portrait.ts`

## Offene Lieferungen

Stand 2026-10-23, Details und Messwerte in `docs/rebranding-v2/07-uebergabe.md`.

- Logo (endgültige Wortmarke), Foto für „Über“, Textkorrektur durch Leon
- Production-Freigabe (nichts ist deployt)
- Jury-Restpunkte: mobile Bühne im Fluss, Grafikpositionen Analyse und Wachstum, Standbilder je Szene bei reduzierter Bewegung, View Transition und gemeinsame Kopfzeile der Rechtsseiten, mobile Szenenleiste, breitere H1, ein Referenzbeispiel

## Hinweis

Produktions-Deployment nur nach Freigabe.
