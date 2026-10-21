# Vercel einrichten

Stand 2026-10-21. Für Leon. Ziel: eine Preview-Adresse zum Prüfen, ohne dass etwas auf `smartflow.bayern` live geht.

Nichts davon ist bisher passiert: Es gibt kein Vercel-Konto, kein Projekt und keine Preview. Die Schritte führst Du selbst aus.

## Was im Repository schon vorbereitet ist

- `vercel.json` sperrt Deployments für den Branch `main` (`git.deploymentEnabled.main: false`) und enthält drei Weiterleitungen für alte Pfade (`/index.html`, `/en/index.html`, `/404.html`).
- Die Sicherheits-Header (inklusive Content-Security-Policy) stehen in `next.config.ts`, nicht in `vercel.json`. Sie gelten damit lokal und auf Vercel gleich.
- Der Branch für die Abnahme heißt `preview/abnahme`. Er wird nach dem Final-Review aus dem lokalen Stand gepusht (nicht von Dir und nicht von diesem Dokument).

## 1. Konto und Projekt

1. Auf vercel.com ein Konto anlegen oder anmelden. Hobby reicht für die Preview; ob für den Live-Betrieb ein anderer Tarif nötig ist, entscheidest Du nach den Vercel-Bedingungen: fehlt (nicht geprüft).
2. Vercel mit dem GitHub-Konto verbinden, das Zugriff auf die Organisation `Smart-Flow-Bayern` hat. Das Repository ist privat; Vercel braucht dafür die Freigabe der GitHub-App für genau dieses Repository.
3. **Add New, Project, Import Git Repository**: `Smart-Flow-Bayern/SmartFlowWebsiteV5` wählen.

## 2. Projekteinstellungen beim Import

| Feld | Wert |
|---|---|
| Framework Preset | Next.js (wird erkannt) |
| Root Directory | `./` |
| Build Command | `pnpm build` |
| Install Command | `pnpm install` (Standard; Vercel liest `packageManager: pnpm@10.21.0` aus `package.json`) |
| Output Directory | Standard (leer lassen) |
| Node.js Version | 22.x oder neuer (`engines.node` verlangt `>=22.18`); unter Settings, General, Node.js Version prüfen |
| Environment Variables | keine nötig |

Dann **Deploy** noch nicht anstoßen, falls Vercel das beim Import automatisch tut: Der erste Deploy würde `main` bauen. `vercel.json` verhindert das für `main`, siehe nächster Abschnitt. Falls Vercel trotzdem einen Build für `main` zeigt, abbrechen.

## 3. Production-Deployments sperren

Zwei Sicherungen, beide nötig bis zur Freigabe:

1. **Im Repository:** `vercel.json` enthält `"git": { "deploymentEnabled": { "main": false } }`. Pushes nach `main` lösen keinen Deploy aus.
2. **In den Einstellungen:** Settings, Git, **Production Branch** vorübergehend auf `release` setzen (ein Branch, den es nicht gibt). Damit kann auch ein manuell angestoßener Deploy nicht versehentlich als Production gelten.

Nach FREIGABE 5 (Du hast die Preview geprüft und gibst frei) drehst Du beides zurück:

- Production Branch wieder auf `main`.
- In `vercel.json` den Block `git.deploymentEnabled.main` entfernen (oder auf `true` setzen), committen, pushen.

Danach geht es mit `docs/deploy/domain-umzug.md` weiter.

## 4. Preview für `preview/abnahme`

1. Warten, bis der Branch `preview/abnahme` im Repository liegt (Controller pusht ihn nach dem Final-Review).
2. Vercel baut ihn automatisch als Preview-Deployment. Settings, Git: Preview-Deployments für alle Branches müssen aktiv sein (Standard).
3. Die Preview-URL steht im Vercel-Dashboard unter Deployments. Sie hat die Form `<projekt>-git-preview-abnahme-<team>.vercel.app`; der genaue Wert ist erst nach dem ersten Build bekannt: fehlt.
4. Preview-Schutz: Vercel schützt Previews standardmäßig per Anmeldung (Deployment Protection). Wenn die Preview nur Dir und ausgewählten Personen zugänglich sein soll, ist das gewollt. Für Lighthouse gegen die Preview brauchst Du ggf. einen Bypass-Token oder schaltest den Schutz kurz ab: Entscheidung bei Dir.
5. URL in `docs/abnahme/checkliste.md` bei „Preview-URL“ eintragen und die Checkliste abarbeiten.

## 5. Nach dem ersten Build prüfen

- Seite lädt, Szene und Modell erscheinen, Konsole ist leer.
- Antwort-Header der Startseite (Browser, Netzwerk-Tab, Dokument `/`): `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` sind gesetzt.
- Der Cal.com-Button öffnet den Kalender; in der Konsole steht keine Meldung mit „Content Security Policy“ oder „Refused to“. Falls doch, die Meldung wörtlich notieren; sie nennt die fehlende Quelle.
- `/index.html` leitet auf `/` weiter, `/en/index.html` auf `/en`.
- `/impressum.html`, `/datenschutz.html`, `/agb.html` und die drei Seiten unter `/en/` laden unverändert.
- Alte Hash-Links: `/#contact` springt zum Kontakt, `/#services` zu Abläufen, `/#process` zum Vorgehen, `/#about` zum Überblick.

## Offen

- Vercel-Konto, Tarif, Team-Name: fehlt.
- Preview-URL: fehlt.
- Lighthouse gegen die Preview (mobil und Desktop): steht aus, Werte kommen nach `docs/performance/2026-10-messung.md`.
