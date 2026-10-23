# Rebranding V2: Übergabe

Stand: 2026-10-23, Branch `rebranding-v2` (lokal `worktree-rebranding-v2-audit`). **Nichts ist deployt.** Production (`main`) ist in `vercel.json` für automatische Deployments deaktiviert; ein Push auf den Branch erzeugt höchstens eine Vercel-Preview.

## Was gebaut wurde

smartflow.bayern ist jetzt eine deutsche Ein-Seiten-Geschichte in sieben Szenen (Komplexität, Analyse, Struktur, Automatisierung, Wachstum, Über, Kontakt). Eine SVG-Prozessgrafik in einer Sticky-Bühne zeigt den Weg vom Durcheinander zum geordneten Ablauf: verstreute Knoten, Gruppen, Spaltenarchitektur mit Datenpaketen, Kreislauf mit Wachstumszonen, am Ende eine aktive Zeile. Alle Texte sind echtes HTML, die Grafik funktioniert ohne JavaScript als Standbild und bei reduzierter Bewegung als ruhiges Bild. Three.js und die Modell-Pipeline sind entfernt, `/en` leitet dauerhaft auf `/` um. Dazu kommen ein Vorschaubild aus derselben Grafik, eine eigene deutsche 404, Metadaten für Start- und Rechtsseiten, Cal.com erst nach Klick und eine E2E-Suite mit axe-Prüfung und Frame-Messung.

## Messwerte

Letzter Lauf nach der Fix-Welle der Abschluss-Review (2026-10-23), lokal gegen den Production-Build. Lighthouse und axe-Jury-Lauf stammen aus dem Stand `1f3cafc` und wurden danach nicht wiederholt.

| Messung | Wert |
|---|---|
| JS-Budget `/` (initial, gzip) | 198 372 Bytes (Grenze 220 000) |
| Lighthouse mobil | Performance 0,96 · Accessibility 1,00 · Best Practices 1,00 · SEO 1,00 |
| Lighthouse Desktop | Performance 1,00 · Accessibility 1,00 · Best Practices 1,00 · SEO 1,00 |
| Frame-Zeit p95 Desktop (1440×900) | 18,3 ms (Ziel ≤ 20 ms; vorher 18,2 ms) |
| Frame-Zeit p95 mobil (iPhone 13) | 18,6 ms (Ziel ≤ 33 ms; vorher 18,1 ms) |
| axe, schwere Verstöße (serious/critical) | 0 (E2E bei Scroll 0 und bei `#kontakt`; Jury-Lauf 2 auf allen 5 Seiten) |
| CSP-Prüfung | keine Verletzungen, Cal.com-Rahmen geöffnet |
| E2E (Playwright, chromium/firefox/mobile) | 77 bestanden, 0 fehlgeschlagen |
| Unit-Tests (Vitest) | 164 bestanden in 27 Dateien |
| Typecheck, Lint, Build | grün |

Lighthouse: Median aus je 3 Läufen (`pnpm lighthouse`, `pnpm lighthouse:desktop`). Frame-Messung: 180 Frames je Gerät (`pnpm measure:frames`, Chromium sichtbar). Der Median liegt bei 16,7 ms, also an der 60-Hz-Bildwiederholung; der p95 zeigt deshalb vor allem VSync-Schwankung und sank durch das Abschalten der Idle-Bewegung ab Szene 02 nicht messbar.

## Jury-Bewertung

Workflow aus dem Jury-Skill: Production-Build lokal (Port 4401, da 4400 belegt war), Screenshots und Audit per Skript, Bewertung durch einen frischen Kritiker ohne Code-Zugang. Schätzwerte, nicht mit Awwwards verbunden. Evidenz und Scorecards liegen lokal unter `.jury/127.0.0.1-4401/` (nicht im Repo).

| Runde | Datum | Kritiker | Jury-Schätzung | Band |
|---|---|---|---|---|
| 1 | 2026-10-23 | 5,6 | etwa 6,7 | Honorable Mention (6,5 bis 7,1) |
| 2 | 2026-10-23 | 6,3 | etwa 7,4 | Site of the Day (ab 7,2) |

Einzelwerte Runde 1 → 2: Design 5 → 6, Usability 5 → 6, Creativity 7 → 7, Content 7 → 7; Semantics/SEO 5 → 7, Animationen 4 → 6, Accessibility 5 → 7, WPO 8 → 8, Responsive 4 → 6, Markup 5 → 7.

Zwischen Runde 1 und 2 behoben (Commit `c42aed8`):

- Fortschrittsanzeige links lag über H1, Text und Footer: unter 1600 px nur noch Balken in der Randspalte, Beschriftung ab 1600 px (Randspalte dort 232 px), am Footer ausgeblendet.
- Mobil lag die Grafik auf dem Text: Text läuft jetzt unter der Bühne hindurch; Knoten-Labels kollidieren im Kreislauf nicht mehr.
- Reduzierte Bewegung: H1 war unter dem Falz; jetzt steht das Standbild neben der H1.
- Navigation markierte eine Szene zu spät: Hervorhebung nach der Section an der Bildschirmmitte.
- Hover-Zustände für alle Buttons und Links.
- Weiße englische Standard-404 ersetzt durch eigene deutsche Seite.
- Rechtsseiten mit Beschreibung, Canonical, Open Graph und Twitter Card; Seitentitel auf 70 Zeichen.
- Sprunglink zum Inhalt, Fokusring der Navigation nicht mehr abgeschnitten, Tap-Flächen im Footer, Footer in derselben Spalte wie die Szenen.

Nach Runde 2 (ohne neue Bewertung, Commit `1f3cafc`): `#kontakt` mit Abstand unter der Kopfzeile, Kontaktblock linksbündig, doppelter Untertitel „Erst Ordnung, dann Entlastung, dann Wachstum.“ in Kontakt entfernt (Spec verlangt ihn nur in Szene 01), Inline-Links der Rechtsseiten 24 px hoch, Sprunglink auch auf Rechtsseiten und 404. Kontrast `muted` (#8d9794) geprüft: 6,6:1 auf `ground`, 5,8:1 auf `groundEnd`, also über 4,5:1; die 29 Treffer „contrastNeedsReview“ sind Text über der SVG-Bühne, den axe nicht selbst beurteilen kann, und wurden damit als geprüft vermerkt.

## Nach der Abschluss-Review behoben

- Grafik steht ab Szene 02 still; das Treiben in Szene 01 ist auf etwa 2 px begrenzt (Spec 5.4).
- Ohne JavaScript und vor der Hydration zeigt das Handy das Standbild zentriert mit Skalierung 1 statt der Desktop-Verschiebung; der No-JS-Test läuft auch im Projekt `mobile`.
- Favicon und Rechtsseiten (`public/legal.css`) auf den acht Blaupause-Tokens; Links der Rechtsseiten in Tinte statt Akzent, Stand-Zeile 16 px.
- Vorschaubild mit Maßen und alt, 404 mit eigenem Titel und eigener Beschreibung für Open Graph.
- Pakete mit `r`-Attribut als Fallback, Sprungziel `#start` und Footer-Jahr auch ohne JavaScript.

## Abweichung von der Spec: Fortschrittsanzeige

Spec Abschnitt 4 verlangt die Fortschrittsanzeige auf dem Desktop als sechs Zeilen mit Nummer und Wort, Abschnitt 5.2 „14 px Mono mit Wort, nicht nur Nummer“. Umgesetzt ist das nur ab 1600 px Breite; darunter, also auch auf dem Referenz-Desktop 1440×900, zeigt die Anzeige nur Balken in der Randspalte, ohne Nummer und ohne Wort (`app/globals.css`, `components/nav/ProgressNav.tsx`). Grund: In Jury-Runde 1 lag die beschriftete Anzeige bei 1440×900 über H1, Text und Footer, obwohl die H1 wie in Spec 5.2 vorgesehen auf 11vh begrenzt ist; die Spec wollte die Kollision über die H1-Größe lösen, das reichte nicht. Die Wörter der sechs Szenen stehen weiterhin in der Kopfnavigation (`SiteNav`), die aktuelle Szene ist dort hervorgehoben; die Balken bleiben klickbar und tragen ihre Beschriftung für Screenreader.

**Entscheidung für Leon:** Heutige Lösung bestätigen (unter 1600 px nur Balken, Wörter in der Kopfnavigation) oder die Beschriftung ab 1280 px zurückholen, mit schmalerer Spalte für die Anzeige und entsprechend schmalerer Textspalte. Die Kollision mit dem Footer ist bereits über das Ausblenden am Footer gelöst; offen wäre nur der Abstand zu H1 und Text. Aufwand für die Alternative: etwa zwei bis drei Stunden mit Sichtprüfung bei 1280, 1440 und 1600 px.

## Offene Punkte

| Punkt | Aufwand |
|---|---|
| Logo: endgültige Wortmarke | Austausch nach der Anleitung unten, etwa eine Stunde plus Sichtprüfung, sobald das Logo als Vektor vorliegt. |
| Foto von Leon für „Über“ | Datei ablegen und `lib/brand/portrait.ts` eintragen, unter einer Stunde. |
| Textkorrektur durch Leon | Alle Texte in `content/de.ts`, Rechtstexte in `public/*.html`; Lesedurchgang etwa eine Stunde. In der Datenschutzerklärung stehen drei Gedankenstriche und ein Satz, der in zwei Abschnitten vorkommt; beides ist Rechtstext und wurde nicht geändert. |
| Production-Freigabe | Entscheidung durch Leon; danach Merge nach `main` und Deployment-Schalter in `vercel.json`. |
| Jury 1: Mobil leere Bildschirme (m-02, m-03) | Bühne unter 720 px nicht mehr anheften, Grafik je Szene im Fluss über dem Text; einen halben bis ganzen Tag, betrifft Scroll-Zuordnung und Tests. Mobil ist der Schlussmoment (Zustand 5, alle 14 Knoten aktiv als Zeile) derzeit durch die Kontakt-Section verdeckt; das wird mit dem Bühnenkonzept gelöst. |
| Jury 2: Analyse-Cluster läuft in Kicker und H1 (d-02) | Verschiebung/Skalierung von Zustand 1 in `scene/process/layouts.ts` anpassen; etwa zwei Stunden mit Sichtprüfung. |
| Jury 3: Wachstumsringe kreuzen den Text, bleiben bis „Über“ (d-05, d-06) | Ringe auf die rechte Spalte begrenzen und für „Über“ einen eigenen Zustand oder ein Ausblenden vorsehen; etwa einen halben Tag. |
| Jury 4: Reduzierte Bewegung zeigt Struktur im Hero, danach keine Grafik | Pro Szene ein statisches Standbild ihres Zustands rendern; etwa einen halben Tag. |
| Jury 5: Harte Seitenwechsel, Rechtsseiten ohne Logo/Navigation; View Transition | `@view-transition` plus gemeinsame Kopf- und Fußzeile für die statischen Rechtsseiten (oder Umzug der Rechtsseiten in Next-Routen); etwa einen Tag. |
| Jury 6: Hover auf Rechtsseiten-Links und Logo nur schwach | Unterstrich-Animation auch auf Rechtsseiten, Logo-Glyphe animieren statt dimmen; zwei bis drei Stunden. |
| Jury 7: Mobile Szenenleiste abgeschnitten, Kopfzeile 192 px hoch | Menü-Button oder Verlauf am rechten Rand, aktiven Link in Sicht scrollen, Logo-Zeile niedriger; etwa einen halben Tag. |
| Jury 13: H1 auf 1440 px sechs Zeilen, Einleitung erst bei y≈887 | Textspalte der ersten Szene breiter (etwa 900 px) und mit der Grafikposition abstimmen; zwei bis drei Stunden. |
| Referenzbeispiel (Jury 10, Inhalt) | Ein echtes Kundenergebnis mit Freigabe des Kunden; Aufwand liegt bei der Beschaffung, der Einbau dauert unter einer Stunde. |
| „Termin wählen“ als gefüllter Button (Jury 8) | Bewusst nicht umgesetzt: Spec verlangt einen sparsam eingesetzten Akzent, gefüllt ist nur „Erstgespräch“. |

## Platzhalter austauschen

1. **Logo:** `components/brand/Wordmark.tsx` setzt die Wortmarke aus Schrift (JetBrains Mono) und der Geometrie in `lib/brand/marks.ts` zusammen (Bildmarke `IMPULSE_PATH`, Abstände); die gewählte Variante steht in `lib/brand/tokens.ts` (`wordmarkVariant`). Ein neues Logo ersetzt die Komponente bzw. die Werte in `marks.ts`. Danach `pnpm brand:svg` (erzeugt `public/brand/*.svg`, die auch das Vorschaubild liest) und `pnpm brand:icons` (erzeugt `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico`) und `/brand` ansehen.
2. **Akzentfarbe:** `--color-accent` in `app/globals.css` und `colors.accent` in `lib/brand/tokens.ts` gemeinsam ändern. Die Rechtsseiten beziehen den Akzent über die Variable `--accent` in `public/legal.css` (einmal in `:root` deklariert, dort neben den übrigen sieben Blaupause-Tokens als Literal, da statisches CSS nichts importieren kann); diesen Wert mitändern. Als Literal steht er außerdem in `tests/unit/brand/wordmark.test.tsx`; `tests/unit/brand/static-svg.test.ts` prüft, dass `legal.css` und `app/icon.svg` mit `lib/brand/tokens.ts` übereinstimmen. Die SVGs und Icons übernehmen ihn nach `pnpm brand:svg` und `pnpm brand:icons`. Danach `pnpm test` (Kontrastprüfung) und `pnpm e2e`.
3. **Foto:** Datei unter `public/brand/` ablegen und in `lib/brand/portrait.ts` `PORTRAIT = { src, width, height }` setzen; `components/about/Portrait.tsx` zeigt dann das Bild statt der Initialen.
