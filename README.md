# Smart Flow Website V5

Neue Unternehmenswebsite von Smart Flow (smartflow.bayern): eine Scroll-Fahrt durch eine 3D-Szene, alle Texte als echtes HTML, Deutsch mit englischer Fassung unter `/en`.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- React Three Fiber für die Szene
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
| `pnpm e2e` | E2E-Tests (Playwright, startet den Dev-Server auf Port 3005) |

Einmalig vor dem ersten E2E-Lauf: `pnpm exec playwright install chromium`.

## Hinweis

Produktions-Deployment nur nach Freigabe.
