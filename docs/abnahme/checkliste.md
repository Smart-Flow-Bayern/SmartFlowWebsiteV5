# Abnahme-Checkliste

Stand 2026-10-21. Für Leon.

Preview-URL: fehlt (Leon trägt ein)

## Lokaler Durchlauf (automatisiert, ohne Preview)

Stand dieses Laufs: lokaler Build, kein Deployment. Details im Task-23-Report.

| Prüfung | Ergebnis |
|---|---|
| Unit-Tests, Typecheck, Lint, Build | grün |
| E2E Chromium (`pnpm e2e`, 64 Tests) | grün |
| E2E Firefox (64 Tests, in `pnpm e2e` enthalten) | grün |
| E2E WebKit (Desktop Safari) | 62 von 64 grün, 2 scheitern aus Browser-Gründen, siehe unten; Projekt ist nicht in der Konfiguration |
| CSP gegen Production-Build (`pnpm check:csp`) | keine Verletzungen auf `/` und `/en`, Cal.com-Embed geladen |

WebKit, die zwei Ausnahmen: `contact.spec.ts` (Tastatur) und `nav.spec.ts` (Tab-Reihenfolge). Safari auf macOS springt mit Tab standardmäßig nicht auf Links und Buttons, nur mit Option+Tab (oder wenn in den Safari-Einstellungen „Tab markiert jedes Element“ an ist). Die Tests laufen mit Tab und finden deshalb keinen Fokus. Das ist Browser-Verhalten, kein Fehler der Seite; die Seite ist mit Option+Tab durchgängig fokussierbar. Beim manuellen Safari-Durchlauf unten daher Option+Tab verwenden. WebKit lokal erneut prüfen: `pnpm exec playwright install webkit`, dann in `playwright.config.ts` das Projekt `{ name: 'webkit', use: { ...devices['Desktop Safari'] } }` ergänzen und `pnpm exec playwright test --project=webkit` ausführen.

Nicht automatisiert prüfbar und deshalb unten manuell: echte Safari-, Edge-, iOS- und Android-Browser, echte GPU, Tastaturbedienung mit den Gewohnheiten des jeweiligen Browsers.

## Browser-Matrix (manuell, auf der Preview)

Pro Zeile „ok“, „Fehler: …“ oder „nicht geprüft“ eintragen. Stand aller Felder: nicht geprüft.

Prüfpunkte je Browser:

1. **Station 0 ohne Modell:** Überschrift und Text von Station 0 sind sofort sichtbar, auch bevor das 3D-Modell geladen ist (Netzwerk drosseln, z. B. Slow 4G).
2. **Fahrt läuft:** Beim Scrollen bewegt sich die Kamera durch die Szene, ohne Ruckeln und ohne Sprünge.
3. **Alle 7 Stationen:** Start, Überblick, Abläufe, Werkzeuge, Automatik, Vorgehen, Kontakt erscheinen nacheinander mit jeweils sichtbarem Text; die Navigation springt auf jede Station.
4. **Cal.com nach Klick:** Vor dem Klick lädt kein Cal.com-Inhalt; nach Klick auf den Termin-Button erscheint der Kalender.
5. **Tastatur-Durchgang:** Tab erreicht Wortmarke, sieben Stationspunkte und Erstgespräch-Button in dieser Reihenfolge, Fokus ist sichtbar, Enter springt zur Station, Kontakt-Bereich ist per Tastatur bedienbar. Safari: Option+Tab.
6. **Reduced Motion:** Systemeinstellung „Bewegung reduzieren“ an: keine Kamerafahrt, pro Station ein Standbild, alle Texte lesbar.
7. **320 px:** Fensterbreite 320 px (oder kleinstes Gerät): kein horizontales Scrollen, nichts abgeschnitten.
8. **Konsole leer:** Keine Fehler und keine Meldung mit „Content Security Policy“ oder „Refused to“.

| Browser | 1 Station 0 | 2 Fahrt | 3 Stationen | 4 Cal.com | 5 Tastatur | 6 Reduced Motion | 7 320 px | 8 Konsole |
|---|---|---|---|---|---|---|---|---|
| Chrome (Desktop) | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft |
| Safari (macOS) | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft |
| Firefox (Desktop) | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft |
| Edge (Desktop) | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft |
| iOS Safari | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft |
| Android Chrome | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft | nicht geprüft |

Auf Touch-Geräten statt Tastatur (Punkt 5): Navigation per Tipp, Cal.com-Button per Tipp. Bildschirmtastatur-Test nicht nötig, es gibt kein Formular.

## Weitere Prüfungen auf der Preview

| Prüfung | Ergebnis |
|---|---|
| Sicherheits-Header am Dokument `/` (fünf Header, siehe `docs/deploy/vercel-einrichten.md`, Abschnitt 5) | nicht geprüft |
| `/index.html` leitet auf `/`, `/en/index.html` auf `/en` | nicht geprüft |
| Alte Anker `/#contact`, `/#services`, `/#process`, `/#about` | nicht geprüft |
| Rechtsseiten (`/impressum.html`, `/datenschutz.html`, `/agb.html`, `/en/legal-notice.html`, `/en/privacy-policy.html`, `/en/terms.html`) | nicht geprüft |
| Deutsch: Sie-Form, keine Emojis, keine Floskeln aus der Sperrliste | nicht geprüft |
| Englische Fassung unter `/en` vollständig | nicht geprüft |

## Offene Punkte

- Lighthouse gegen die Preview, mobil und Desktop (Ziele: mobil Performance ≥ 70, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95; Desktop Performance ≥ 90): steht aus, braucht die Preview-URL. Werte danach in `docs/performance/2026-10-messung.md` ergänzen. Befehl: `pnpm exec lhci collect --url=<Preview-URL> --numberOfRuns=3`, Desktop zusätzlich `--settings.preset=desktop`. Ist Deployment Protection aktiv, braucht Lighthouse einen Bypass.
- Frame-Zeiten auf echter GPU im Zielbrowser (p95 ≤ 33 ms): lokal mit `pnpm measure:frames` gemessen (siehe Messdokument), auf Preview und auf echten Mobilgeräten nicht geprüft.
- Schema.org-Felder, die nur Du liefern kannst: `docs/content/seo-offen.md`.
- Freigabe 5: fehlt (Leon).
