# Rebranding V2 – Phase 03: Storyboard und Architektur

Stand: 2026-10-23. Gilt für alle drei Richtungen aus `02-konzepte.md`; Unterschiede sind nur Tokens und Knotenform. Vorschau: `mockups/konzepte.html`.

---

## 1. Szenen

Scrollweg gesamt: 6 Bildschirmhöhen (eine je Szene) plus Fußzeile. Auf dem Handy ebenfalls 6, die Grafik belegt die obere Hälfte, der Text die untere.

| # | Szene | Inhalt (HTML, immer lesbar) | Layout Desktop | Grafik-Zustand | Übergang zur nächsten Szene |
|---|---|---|---|---|---|
| 01 | Komplexität | H1 (ein Problemsatz aus dem Betriebsalltag), ein Lead-Satz, Claim „Structure. Automation. Growth.“ mit deutschem Untertitel, Hinweis „Scrollen“ | Text links, Grafik rechts | 14 Knoten verstreut, 26 Fragmente (kurze Striche), langsames Treiben (Idle) | Fragmente verblassen, Knoten ziehen in drei Gruppen |
| 02 | Analyse | H2, ein Absatz: verstehen, bevor wir ändern | Text rechts, Grafik links | Drei Gruppen (Eingang, Arbeit, Abschluss), gestrichelte Kanten, Labels erscheinen gruppenweise, eine Gruppe nach der anderen kurz aktiv | Gruppen rasten in Spalten ein |
| 03 | Struktur | H2, Absatz, drei nummerierte Punkte (einmal erfassen, eine Stelle, klare Zuständigkeit) | Text links, Grafik rechts (schmaler, 58 % Skalierung) | Prozessarchitektur: Eingang (3), Bearbeitung (6), Entscheidung (1), Ausgang (4), Kanten durchgezogen, als Bezier | Pakete starten |
| 04 | Automatisierung | H2, Absatz mit drei konkreten Automatisierungen (Rechnung, Termin, Nachfass) | Text rechts, Grafik links | Gleiche Architektur; 9 Pakete laufen über die Kanten, Knoten schalten Status, Verzweigung an der Entscheidung | Architektur verdichtet sich zum Kreislauf |
| 05 | Wachstum | H2, Absatz, drei Nutzenfelder (Effizienz, Skalierbarkeit, Produktivität) ohne Zahlen | Text links mit Feldern, Grafik rechts | Kreislauf aus 14 Knoten, drei konzentrische Nutzenfelder erscheinen nacheinander, Pakete laufen aus | Knoten sammeln sich in einer Zeile |
| 06 | Kontakt | H2 mit Claim, Absatz, CTA „Termin wählen“ (Cal.com nach Klick), E-Mail-Button, darunter Fußzeile | zentriert | Knoten als eine Linie unter dem CTA, alle aktiv; Nutzenfelder bleiben als Ringe im Hintergrund | Ende |

Über-Einblendung („Wer dahintersteht“, Leon Heinrich, Regensburg): zwischen Szene 05 und 06 als kurzer Textblock ohne eigenen Grafikzustand, auf dem Handy als eigener Abschnitt. Alternativ in die Fußzeile. Entscheidung in Phase 05.

## 2. Scroll- und Übergangslogik

- **Ein Driver:** `progress` in [0, 5], gleich `scrollTop / (5 × Fensterhöhe)` innerhalb der Story. Ganzzahlteil = Zustand, Nachkommateil = Übergang. Übergänge nutzen eine Ease-in-out-Kurve (kubisch), damit die Szene in der Mitte ruht.
- **Weiches Nachziehen:** Der dargestellte Fortschritt folgt dem Zielwert mit Faktor 0,12 je Frame (Lenis bleibt für das Scrollen, GSAP-Ticker als einzige Uhr).
- **Idle:** Eine langsame Zeitkomponente lässt Knoten um 1 bis 2 px treiben, auch wenn niemand scrollt. Unter Reduced Motion aus.
- **Kanten:** sichtbar, wenn sie im aktuellen oder nächsten Zustand enthalten sind; Opazität wird über den Übergang interpoliert. So gibt es keine Schnitte.
- **Pakete:** laufen nur in Zustand 4 (voll), blenden in 3 ein und in 5 aus. Position auf der Bezier-Kurve aus Zeit und Index.
- **Hintergrund:** hellt linear mit dem Fortschritt auf (`color-mix` zwischen Grund und Endton), Textfarbe über eine globale Variable, damit jede Szene lesbar bleibt.
- **Layout-Ausweichen:** Die Grafik wird je Zustand horizontal verschoben und skaliert (Desktop: ±170 bis ±290 Einheiten im 1000er-ViewBox, Skalierung 0,58 bis 0,8), interpoliert zwischen Zuständen. Mobil keine Verschiebung.
- **Reduced Motion:** keine Scroll-Kopplung, Grafik zeigt Zustand 3 als Standbild, alle Szenen untereinander mit normalem Abstand.
- **Deep Links:** `/#analyse`, `/#struktur` usw. springen zum Szenenanfang; die bestehende Navigation aus V5 (`SiteNav`, Deep-Link-Logik, Tastatur) bleibt und bekommt neue Anker.

## 3. Technisches Zustandsmodell

```
progress: number (0..5)                      // aus ScrollProvider (vorhanden)
state = floor(progress), t = ease(frac)      // reine Funktion
layout[state]: { nodes: [x,y][], edges: [a,b][], dashed, shift, scale, packets, zones, labels }
frame(progress, time) -> {
  nodes: [{x, y, r, active}],                // interpoliert layout[state] -> layout[state+1]
  edges: [{a, b, opacity, curved, strong}],
  packets: [{x, y, opacity}],
  zones: [{opacity}],
  background: string,
  transform: string
}
```

- `scene/process/layouts.ts`: die sechs Layouts als Daten (Positionen, Kanten, Gruppen). Testbar ohne DOM.
- `scene/process/frame.ts`: `frame(progress, time)`, reine Funktion, Unit-Tests für Grenzen (0, 5), Mitte jedes Übergangs, Kantenopazität.
- `components/process/ProcessStage.tsx`: rendert das Ergebnis von `frame()` als SVG, aktualisiert Attribute im GSAP-Ticker, keine React-Re-Renders pro Frame (Refs auf die SVG-Elemente).
- `components/scenes/*.tsx`: sechs Szenen als HTML, Inhalte aus `content/de.ts` und `content/en.ts` (Typen werden auf die neuen Szenen umgestellt).
- `lib/scroll/visibility.ts` (vorhanden): bleibt für die Overlay-Sichtbarkeit, Stationsfenster werden auf sechs Szenen umgestellt.

Ersetzt werden: `scene/model/*`, `scene/camera.ts`, `scene/lighting.ts`, `scene/stations.ts`, `components/scene/*`, `components/stations/*`, `components/static/StaticStations.tsx`, `public/models/`, `public/stations/`, die Scripts `model:export`, `stations:render`, `measure:frames` (wird durch eine SVG-Frame-Messung ersetzt) sowie die Abhängigkeiten `three`, `@react-three/fiber`, `@react-three/drei`, `@gltf-transform/cli`, `@types/three`.

Bleiben: Next.js-Gerüst, `ScrollProvider` (Lenis plus ScrollTrigger), `SiteNav`, `Footer`, `CalEmbed`, Wortmarke und Impuls (Platzhalter bis zum neuen Logo), Content-Typisierung und Floskel-Prüfung, SEO-Schema, Sitemap, i18n, Security-Header, CSP (ohne `blob:`/WebGL-Ausnahmen, wird geprüft), Tests und Budget-Script.

## 4. Mobile Experience

- Grafik oben (52 svh), Text unten, Scrollweg gleich 6 Bildschirmhöhen.
- Keine Verschiebung der Grafik, keine Skalierung unter 1.
- Fragmente in Szene 01 auf 12 reduziert, Pakete auf 5, kein Blur, kein Drop-Shadow (Richtung C).
- Fortschrittsanzeige ausgeblendet, Navigation als eine Zeile wie in V5 (320 px getestet).
- Tap-Ziele mindestens 44 px, Buttons volle Breite ab 390 px.
- Schriftgrößen: H1 36 bis 56 px, H2 28 bis 40 px, Text 17 px.

## 5. Conversion-Pfade

1. **Rahmen-CTA „Erstgespräch“** oben rechts, auf jeder Szene sichtbar, springt zu Szene 06.
2. **Szene 06:** „Termin wählen“ lädt Cal.com erst nach Klick (vorhandene `CalEmbed`-Komponente, Datenschutzhinweis bleibt), daneben E-Mail als Button, Telefon in der Fußzeile.
3. **Fußzeile:** Adresse, Impressum, Datenschutz, AGB, Sprachwechsel.
4. Keine Formulare, kein Newsletter, keine Pop-ups.

## 6. Architektur-Entscheidungen

| Entscheidung | Begründung |
|---|---|
| SVG statt Canvas 2D | 14 Knoten, rund 30 Kanten, 9 Pakete: weit unter der Grenze, ab der Canvas nötig wäre. SVG ist zugänglich, stylbar über Tokens, testbar im DOM und im Standbild identisch. |
| Kein Three.js, kein WebGL | Vorgabe des Master-Prompts, Leons Entscheidung, spart rund 265 kB gzip und den Gerätefallback. |
| GSAP-Ticker plus Lenis bleiben, keine weitere Animationsbibliothek | Eine Uhr, eine Scroll-Quelle, wie in V5. `Motion` oder Framer wird nicht ergänzt. |
| Reine Funktionen für Layout und Frame | Unit-Tests ohne Browser, gleiche Logik für Standbild (Reduced Motion) und OG-Bild. |
| Sticky Stage (CSS) statt GSAP-Pin | Robuster bei Resize und mobiler Adressleiste, keine Pin-Spacer. |
| Content in `content/de.ts` und `content/en.ts` | Bleibt; Typen werden auf sechs Szenen umgestellt, Floskel-Test bleibt verbindlich. |
| Logo als austauschbare Komponente | `components/brand/Wordmark.tsx` bleibt der einzige Einbauort; neues Logo wird dort ersetzt, Favicon und OG-Bild folgen aus einer Quelle. |

## 7. Budget und Ziele (neu)

| Ziel | Wert |
|---|---|
| JS der Startseite gesamt, gzip | < 220 kB (React/Next ~120, GSAP/Lenis ~54, Rest) |
| Lighthouse mobil, auch im Software-Renderer | Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 |
| Frame-Dauer p95 beim Scrollen | ≤ 20 ms Desktop, ≤ 33 ms mobil |
| FCP | < 1,5 s auf simuliertem 4G |
| CLS | 0 |

## 8. Umsetzungsphasen (Vorschlag für Phase 05)

1. Tokens und Typografie der gewählten Richtung in `app/globals.css`, Logo-Slot.
2. `layouts.ts` und `frame.ts` mit Tests.
3. `ProcessStage` als SVG, an `ScrollProvider` gekoppelt, Reduced-Motion-Standbild.
4. Sechs Szenen als HTML, Content-Typen umstellen, Texte final (Floskel-Test).
5. Navigation und Deep Links auf sechs Szenen, Fußzeile, Kontakt.
6. Three.js und Modell-Pipeline entfernen, Budget-Script und CSP anpassen.
7. Englisch nachziehen, SEO-Schema prüfen, OG-Bild neu.
8. QA: Unit, E2E (Chromium, Firefox), Lighthouse, axe, `jury`-Score, Browser-Matrix.
