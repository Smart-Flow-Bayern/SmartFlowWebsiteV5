# Abgleich Signal gegen ui-ux-pro-max

Stand: 2026-10-21. Interne Dokumentation.

## Vorgehen

- Werkzeug: `uipro` 2.15.0 (global vorhanden), `uipro init --offline` im Repo-Root.
- Abfrage: "consulting for process optimization and AI automation for small businesses, dark cinematic 3D scroll experience, single lime accent", mit `--design-system --persist`, Projektname "Smart Flow".
- Ergebnis: `docs/design-system/MASTER.md` (unverändert vom Werkzeug erzeugt).
- Das Werkzeug schlägt Dark Mode (OLED), Inter, Primärfarbe `#0F172A` und einen grünen Akzent `#16A34A` vor. Diese Vorschläge gelten für Signal nicht. Die Spec-Entscheidungen sind bindend: Farben, Schriften, ein einziger Limetten-Akzent, kein zweiter Akzent. Vom Werkzeug werden nur Skalen und Prüfpunkte übernommen.
- Die vom Befehl installierten Skill-Dateien und der Ausgabeordner `design-system/` wurden nach dem Kopieren von `MASTER.md` wieder entfernt. Es wurde keine bestehende Datei verändert.

## Abgleich

| Thema | Empfehlung des Tools | Entscheidung für Signal |
|---|---|---|
| Spacing-Skala | 4 / 8 / 16 / 24 / 32 / 48 / 64 px (`--space-xs` bis `--space-3xl`) | übernommen als Raster (4er-Basis, Stufen 4, 8, 16, 24, 32, 48, 64). Für Szenenabstände zwischen Stationen sind größere Werte in `vh` zulässig, weil der Scrollweg in Bildschirmhöhen geplant ist. |
| Typo-Skala | Keine eigene Skala. Nur Inter für Überschrift und Text, Fließtext 16 px. | abweichend, Grund: Schrift ist per Spec festgelegt (Schibsted Grotesk, JetBrains Mono). Übernommen wird nur die Mindestgröße von 16 px für Fließtext. |
| Farben | Primär `#0F172A`, Hintergrund `#020617`, Akzent `#16A34A`, Muted `#94A3B8`, zusätzlich Destructive `#DC2626` | abweichend, Grund: Palette ist per Spec festgelegt (`#050607`, `#141618`, `#DDFF4D`, `#7A8A8A`, `#F4F6F5`). Kein zweiter Akzent, auch keine Fehlerfarbe als zusätzlicher Akzent. Fehlerzustände werden über Text und Symbol gekennzeichnet. |
| Schrift laden | Google-Fonts-Import per `@import` | abweichend, Grund: Spec verlangt lokale woff2-Dateien ohne Abrufe zur Laufzeit. |
| Schatten | Vier Stufen `--shadow-sm` bis `--shadow-xl` | abweichend, Grund: Auf `#050607` sind Schlagschatten kaum sichtbar. Tiefe entsteht über Flächenfarbe `#141618` und die Ausleuchtung der Szene. |
| Kontrast | Mindestens 4.5:1 für Text | übernommen. Nachrechnung siehe unten. |
| Anti-Patterns: Emojis als Icons | Verboten, SVG-Icons verwenden | übernommen (deckt sich mit der globalen Vorgabe, keine Emojis). |
| Anti-Patterns: fehlender `cursor: pointer` | Auf allen klickbaren Elementen setzen | übernommen. |
| Anti-Patterns: Layout-Sprünge bei Hover | Keine Scale-Transforms, die das Layout verschieben | übernommen. |
| Anti-Patterns: Zustandswechsel ohne Übergang | Übergänge von 150 bis 300 ms | übernommen für UI-Elemente. Szenen-Animationen folgen der Scroll-Fahrt und sind davon ausgenommen. |
| Anti-Patterns: unsichtbarer Fokus | Fokus muss sichtbar sein | übernommen. Fokusring in Akzent `#DDFF4D`. |
| Anti-Patterns: langsame Dashboards, dekorative Charts, versteckte Fehlerzustände | Vermeiden | übernommen, soweit relevant. Die Seite enthält keine Dashboards oder Charts. |
| Seitenmuster | "Real-Time / Operations Landing" mit Live-Telemetrie, Demo-CTA, Metrik-Block | abweichend, Grund: Die Seite ist eine geführte Scroll-Fahrt mit Stationen, keine Live-Ansicht. Übernommen wird nur: Statisches Standbild bei `prefers-reduced-motion`, Tastatursteuerung, CTA in der Navigation. Es werden keine Live-Zahlen gezeigt, die nicht aus einer echten Quelle stammen. |
| Checkliste: kein Emoji als Icon, konsistentes Icon-Set | Prüfpunkt | übernommen. |
| Checkliste: `cursor-pointer`, Hover-Übergänge 150 bis 300 ms | Prüfpunkt | übernommen. |
| Checkliste: Kontrast 4.5:1 | Prüfpunkt (im Tool für Light Mode formuliert) | übernommen, gilt hier für alle Textfarben auf dem dunklen Hintergrund. |
| Checkliste: sichtbarer Fokus | Prüfpunkt | übernommen. |
| Checkliste: `prefers-reduced-motion` | Prüfpunkt | übernommen. Deckt sich mit der globalen Vorgabe (keine Kamerafahrt, Standbild pro Station). |
| Checkliste: Breakpoints 375 / 768 / 1024 / 1440 px | Prüfpunkt | übernommen als Prüfbreiten für die Abnahme. |
| Checkliste: kein Inhalt hinter fixierter Navigation | Prüfpunkt | übernommen. |
| Checkliste: kein horizontaler Scroll auf Mobil | Prüfpunkt | übernommen. |
| Key Effects: Glow, Dark-to-light-Übergänge | Leichter Textglow, Übergang dunkel nach hell | abweichend, Grund: Dunkel nach hell wird über die Hintergrundhelligkeit (`#050607` bis etwa `#1A1D20`) und die Szenenbeleuchtung erreicht. Kein Textglow, kein Verlauf außer Licht und Schatten in der Szene. |

## Kontrast (WCAG 2.x, relative Luminanz)

| Vordergrund | Hintergrund | Verhältnis |
|---|---|---|
| #DDFF4D | #050607 | 17.85 |
| #7A8A8A | #050607 | 5.63 |
| #F4F6F5 | #050607 | 18.68 |
| #DDFF4D | #141618 | 15.97 |
| #7A8A8A | #141618 | 5.04 |
| #F4F6F5 | #141618 | 16.71 |
| #7A8A8A | #1A1D20 | 4.70 |
| #050607 | #DDFF4D | 17.85 (Text auf Akzent-Button) |

Ergebnis: `#7A8A8A` erfüllt WCAG AA (mindestens 4.5) auf allen drei Hintergründen (`#050607`, `#141618`, `#1A1D20`), auch für Fließtext. Eine Einschränkung auf große Schrift oder Labels ist nicht nötig. Hinweis: Auf `#1A1D20` ist die Reserve mit 4.70 klein. Wird der Hintergrund dort noch heller gewählt, muss neu gerechnet werden.

## Marken-Board

Übersprungen. In dieser Sitzung stand keine Bildgenerierung zur Verfügung, deshalb gibt es kein `docs/brand/signal-board.png`.
