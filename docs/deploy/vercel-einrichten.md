# Vercel einrichten

Stand 2026-10-21. Für Leon. Ziel: eine Preview-Adresse zum Prüfen, ohne dass etwas auf `smartflow.bayern` live geht.

Nichts davon ist bisher passiert: Es gibt kein Vercel-Konto, kein Projekt und keine Preview. Die Schritte führst Du selbst aus.

**Nachtrag 2026-10-26:** Leon hat den Stand von `main` für den Livegang freigegeben. Die Sperre `git.deploymentEnabled.main` ist aus `vercel.json` entfernt, die Branches `preview/abnahme` und `release` entfallen. Production Branch ist `main`; Abschnitt 3 und 4 sind damit überholt. Das Projekt kann direkt über **Add New, Project, Import Git Repository** angelegt werden, der erste Build ist dann die Live-Version auf der vercel.app-Adresse. Danach weiter mit `docs/deploy/domain-umzug.md`.

## Was im Repository schon vorbereitet ist

- `vercel.json` sperrt Deployments für den Branch `main` (`git.deploymentEnabled.main: false`) und enthält drei Weiterleitungen für alte Pfade (`/index.html`, `/en/index.html`, `/404.html`).
- Die Sicherheits-Header (inklusive Content-Security-Policy) stehen in `next.config.ts`, nicht in `vercel.json`. Sie gelten damit lokal und auf Vercel gleich.
- Der Branch für die Abnahme heißt `preview/abnahme`. Er wird für Dich gepusht, sobald der Stand geprüft ist; Du musst ihn nicht selbst anlegen.

**Wichtig zur Reihenfolge:** Auf GitHub liegt in `origin/main` bisher nur das Gerüst, `vercel.json` ist dort noch nicht enthalten. Die Sperre aus `vercel.json` greift deshalb erst, wenn die Datei auf `main` liegt, also nach dem Merge. Bis dahin ist die Einstellung im Dashboard (Production Branch auf `release`) die einzige Sperre. Darum wird das Projekt zuerst ohne Deployment angelegt und gesperrt, und erst danach wird gepusht.

## 1. Konto

1. Auf vercel.com ein Konto anlegen oder anmelden. Plan: fehlt (prüfen).
2. Vercel mit dem GitHub-Konto verbinden, das Zugriff auf die Organisation `Smart-Flow-Bayern` hat. Das Repository ist privat; die GitHub-App von Vercel braucht dafür die Freigabe für genau dieses Repository.

## 2. Projekt anlegen, ohne zu deployen

Im Repository-Ordner:

```bash
npx vercel login
npx vercel link
```

`vercel link` legt das Projekt an und verknüpft den Ordner. Es baut nichts. Beim Anlegen: Framework Next.js, Root Directory `./`.

Alternative: im Dashboard **Add New, Project, Import Git Repository**. Das ist **nicht empfohlen**. Erwartung, nicht geprüft: Der Import baut sofort einmal `origin/main` (nur das Gerüst) als Production auf einer vercel.app-Adresse, noch bevor Du eine Sperre setzen kannst, und das Importfenster hat kein Feld für den Production Branch.

## 3. Production sperren, bevor gepusht wird

Dashboard, Projekt, Settings, Git:

1. Repository `Smart-Flow-Bayern/SmartFlowWebsiteV5` verbinden (Connect Git Repository).
2. **Production Branch** auf `release` setzen (ein Branch, den es nicht gibt). Damit kann nichts als Production gebaut werden.
3. Preview-Deployments für alle Branches aktiv lassen (Standard).

Dazu die Projekteinstellungen (Settings, General bzw. Build and Development):

| Feld | Wert |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `./` |
| Build Command | `pnpm build` |
| Install Command | `pnpm install` (Vercel liest `packageManager: pnpm@10.21.0` aus `package.json`) |
| Output Directory | Standard (leer lassen) |
| Node.js Version | 22.x oder neuer (`engines.node` verlangt `>=22.18`) |
| Environment Variables | keine nötig |

Erst wenn Schritt 3 gesetzt ist, wird `preview/abnahme` gepusht (Abschnitt 4).

Nach FREIGABE 5 (Du hast die Preview geprüft und gibst frei) drehst Du beides zurück:

- Production Branch wieder auf `main`.
- In `vercel.json` den Block `git.deploymentEnabled.main` entfernen (oder auf `true` setzen), committen, pushen.

Danach geht es mit `docs/deploy/domain-umzug.md` weiter.

## 4. Preview für `preview/abnahme`

1. Der Branch `preview/abnahme` wird für Dich gepusht, sobald Schritt 3 erledigt ist. Der Push erzeugt das erste Preview-Deployment.
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
