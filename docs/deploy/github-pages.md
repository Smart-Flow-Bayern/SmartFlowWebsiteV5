# Livegang über GitHub Pages

Stand 2026-10-27. Für Leon. Ersetzt die früheren Anleitungen für Vercel (`vercel-einrichten.md`, `domain-umzug.md`); Leon hat sich für GitHub Pages entschieden.

## Wie die Seite ausgeliefert wird

- `pnpm build` erzeugt einen statischen Export im Ordner `out/` (`output: "export"` in `next.config.ts`). Es läuft kein Server.
- Der Workflow `.github/workflows/pages.yml` startet bei jedem Push auf `main`: Lint, Typecheck, Unit-Tests, Build, JS-Budget, danach Deployment auf GitHub Pages. Schlägt ein Schritt fehl, bleibt die bisherige Version online.
- Lokal prüfen wie auf Pages: `pnpm build && pnpm preview` (statischer Server auf Port 3006).
- Pages kennt keine eigenen Header und keine Server-Weiterleitungen. Deshalb:
  - Die Content-Security-Policy steht als `<meta>`-Tag im Layout (`lib/security/csp.ts`). `frame-ancestors` wirkt dort nicht.
  - `X-Content-Type-Options`, `Permissions-Policy`, `X-Frame-Options` und das lange Caching der Schriften entfallen. Der Referrer bleibt beim Browser-Standard (`strict-origin-when-cross-origin`).
  - `/en` leitet per `<meta refresh>` auf `/` (`app/en/page.tsx`). Unbekannte Adressen, auch `/en/...`, zeigen die 404-Seite mit Link zur Startseite.
  - Das Vorschaubild liegt unter `/og.png` (`app/og.png/route.tsx`).

## Ausgangslage (geprüft am 2026-10-27)

- `smartflow.bayern` ist im Repository `Smart-Flow-Bayern/SmartFlowWebsite_v3` als Custom Domain eingetragen (Branch `SmartFlow`, letzter Build 2026-09-03 erfolgreich).
- Trotzdem liefert `https://smartflow.bayern` die GitHub-Fehlerseite „Site not found“ (404). Die alte Seite ist derzeit nicht erreichbar.
- DNS: Apex `smartflow.bayern` hat einen A-Record `185.199.108.153` (GitHub empfiehlt vier). `www` ist ein CNAME auf `automationsbyl-prog.github.io`, also auf ein anderes GitHub-Konto als die Organisation.
- Mögliche Ursache für den 404: Die Domain ist im Konto `automationsbyl-prog` als verifizierte Domain hinterlegt, sodass Repositories der Organisation sie nicht nutzen dürfen. Nicht geprüft, dafür fehlt der Zugriff auf dieses Konto.
- Registrar und vollständige DNS-Einträge (MX, TXT): fehlt.

## Schritte

### 1. GitHub Pages im Repository V5 einschalten

`Smart-Flow-Bayern/SmartFlowWebsiteV5`, Settings, Pages, Source: **GitHub Actions**. Danach unter Actions den Workflow „GitHub Pages“ einmal von Hand starten (Run workflow) oder auf den nächsten Push warten.

Ohne Custom Domain landet die Seite zunächst unter `https://smart-flow-bayern.github.io/SmartFlowWebsiteV5/`. Dort fehlen Schriften und Skripte, weil die Seite für die Wurzel einer Domain gebaut ist. Das ist erwartet; richtig prüfen lässt sie sich erst unter der Domain.

### 2. Domain vom alten Repository lösen

Eine Custom Domain kann nur an einem Repository hängen.

1. `SmartFlowWebsite_v3`: Settings, Pages, Custom Domain leeren und speichern.
2. Falls `smartflow.bayern` unter `automationsbyl-prog`, Settings, Pages, „Verified domains“ steht: dort entfernen und in der Organisation `Smart-Flow-Bayern`, Settings, Pages, neu verifizieren (GitHub nennt einen TXT-Eintrag für das DNS).

### 3. Domain im Repository V5 eintragen

`SmartFlowWebsiteV5`, Settings, Pages, Custom Domain: `smartflow.bayern`. Wenn die DNS-Prüfung grün ist: **Enforce HTTPS** anhaken (das Zertifikat kann bis zu einer Stunde dauern).

### 4. DNS ergänzen

Beim Registrar, alte Einträge vorher sichern. MX- und TXT-Einträge nicht anfassen.

| Name | Typ | Wert |
|---|---|---|
| `@` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `@` | AAAA | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| `www` | CNAME | `smart-flow-bayern.github.io` |

Die Werte vor dem Eintragen mit der GitHub-Dokumentation „Managing a custom domain for your GitHub Pages site“ abgleichen.

### 5. Danach prüfen

- `https://smartflow.bayern`, `https://www.smartflow.bayern` (leitet um), `/en`, `/impressum`, `/datenschutz`, `/agb`, `/robots.txt`, `/sitemap.xml`, `/og.png`.
- Cal.com-Kalender öffnet sich nach Klick auf „Termin wählen“.
- E-Mail an `info@smartflow.bayern` funktioniert weiterhin.
- Google Search Console: Sitemap `https://smartflow.bayern/sitemap.xml` einreichen. Wie die Property verifiziert ist: fehlt.

## Zurückrollen

Custom Domain in V5 leeren und wieder in `SmartFlowWebsite_v3` eintragen. Weil die alte Seite derzeit ohnehin nicht erreichbar ist, gewinnt man damit allerdings nichts.

## Offen vor dem Livegang

Datenschutzerklärung, Abschnitt „3. Hosting“: am 2026-10-27 für GitHub Pages ergänzt (GitHub, Inc., USA; Data Privacy Framework). Prüfung durch Leon bzw. seinen Anwalt steht aus, offene Punkte in `docs/content/rechtstexte-offen.md`.
