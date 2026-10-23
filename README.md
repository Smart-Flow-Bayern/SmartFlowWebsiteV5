# Smart Flow Website V5

Neue Unternehmenswebsite von Smart Flow (smartflow.bayern): eine Scroll-Fahrt durch eine 3D-Szene, alle Texte als echtes HTML, nur Deutsch (`/en` leitet dauerhaft auf die Startseite).

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- Three.js 0.186 (Modell), React Three Fiber 9 und drei 10 für die Szene (Testansicht unter `/dev/model`)
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
| `pnpm model:export` | Erzeugt `public/models/computer.glb` aus `scene/model/buildComputer.ts` (Meshopt-komprimiert) |
| `pnpm e2e` | E2E-Tests (Playwright, Chromium und Firefox, startet den Dev-Server auf Port 3005) |
| `pnpm check:csp` | Prüft die Content-Security-Policy gegen den Production-Build (`pnpm start -p 3006` muss laufen) |

Einmalig vor dem ersten E2E-Lauf: `pnpm exec playwright install chromium firefox`.

## Hinweis

Produktions-Deployment nur nach Freigabe.
