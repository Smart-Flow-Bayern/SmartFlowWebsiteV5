# Rebranding V2 – Phase 02: Drei Designrichtungen

Stand: 2026-10-23. Grundlage: Audit (`01-audit.md`) und Leons Entscheidungen vom 2026-10-23:

- Die Prozessgeschichte (Komplexität, Analyse, Struktur, Automatisierung, Wachstum, Kontakt) ersetzt den Computer-Tauchgang.
- Logo bleibt vorerst wie im Code (Signal-Wortmarke als Platzhalter), Leon liefert ein Logo nach. Der Logo-Slot wird austauschbar gehalten.
- Claim „Structure. Automation. Growth.“, auch auf der deutschen Seite.
- Zielgruppe bleibt: Handwerk, Praxis, Hausverwaltung, kleine Betriebe. Sie-Form, keine Floskeln.
- Three.js raus, Prozessgrafik in SVG und DOM.
- Eine Seite, keine Unterseiten (außer Rechtstexte).

**Vorschau zum Vergleichen:** `docs/rebranding-v2/mockups/konzepte.html` im Browser öffnen (Doppelklick genügt, Fonts werden aus `public/fonts` geladen). Oben umschalten zwischen A, B, C oder Tasten 1, 2, 3. Scrollen führt durch alle sechs Zustände; die Grafik ist bereits eine einzige zusammenhängende Visualisierung, die ihren Zustand ändert. Die Texte sind Platzhalter aus V5, neu formuliert; sie werden in Phase 05 fertig geschrieben.

---

## Gemeinsamer Kern aller drei Richtungen

Was sich zwischen den Richtungen nicht ändert, weil es aus dem Master-Prompt folgt:

- **Ein Driver.** Der Scrollfortschritt (0 bis 5) steuert alles: Knotenpositionen, Kanten, Datenpakete, Hintergrundhelligkeit, Fortschrittsanzeige. Es gibt keine fünf getrennten Animationen.
- **Dieselben 14 Knoten** von Anfang bis Ende: Anfrage, Angebot, Auftrag, Termin, Material, Einsatz, Stunden, Rechnung, Zahlung, Nachfass, Kunde, Team, Ablage, Rückfrage. Begriffe aus dem Betriebsalltag, keine Technikwörter.
- **Sechs Zustände:** verstreut, gruppiert, Prozessarchitektur (Eingang, Bearbeitung, Entscheidung, Ausgang), aktiv mit Paketen, verdichteter Kreislauf mit Nutzenfeldern, Bündelung unter Claim und Kontakt.
- **Layoutregel:** Die Grafik weicht dem Text aus. Text links, Grafik rechts, und umgekehrt, im Wechsel. Mobil: Grafik oben, Text unten.
- **Typografie:** Schibsted Grotesk für Überschriften und Text (700 bis 800, Laufweite −0,03 em), JetBrains Mono für Labels, Nummern, Wortmarke, Buttons. Beide liegen lokal vor. Unterschiede zwischen den Richtungen liegen in Farbe, Form der Knoten, Kantenführung und Motion-Verb, nicht in der Schriftwahl.
- **Rahmen:** Wortmarke links oben, „Erstgespräch“ rechts oben, Fortschritt links unten als sechs Zeilen (Desktop), ausgeblendet auf dem Handy.
- **Fallbacks:** Reduced Motion zeigt Zustand 3 (Struktur) als Standbild, alle Texte normal lesbar. Kein WebGL mehr, daher kein Gerätefallback nötig.

## Richtung A: Signal

**Idee in einem Satz:** Die Website ist eine Leiterbahn, auf der ein Impuls von der Störung bis zum Kontakt läuft.

| | |
|---|---|
| Anker | Die vorhandene Signal-Marke aus V5: Impuls, Leiterbahn, ein Akzent. |
| Palette | Grund `#050607` hellt bis `#15181B` auf, Text `#F4F6F5`, gedimmt `#8A9797`, Akzent `#DDFF4D` (nur aktive Knoten, Pakete, Impuls, CTA). |
| Knoten | Rauten (Chip-Form), Kanten gerade bzw. als Bezier, in Analyse gestrichelt. |
| Motion-Verb | „Pulsieren entlang einer Bahn“: Impuls läuft, Knoten leuchten kurz auf, Linien zeichnen sich. |
| Signaturmoment | Zustand 4: Pakete laufen über die Leiterbahnen, Knoten schalten Status. |
| Screenshot-Frame | Dunkle Fläche, eine Prozessarchitektur in Hairlines, drei Knoten gelbgrün aktiv. |
| Markenwirkung | Technisch, präzise, nah an V5. Für Tech-Zielgruppen stark, für Handwerksmeister die kühlste Variante. |
| Umsetzbarkeit | Hoch. Tokens, Fonts, Wortmarke, OG-Bild aus V5 bleiben. |
| Performance | Sehr gut. Reine SVG-Pfade, kein Shader. |
| Bedienbarkeit | Gut. Kontrast Akzent auf Grund 17,9:1, gedimmt auf Grund 6,7:1 (berechnet nach WCAG). |
| Risiko | „Near-black plus ein Acid-Akzent“ ist ein bekannter KI-Default-Look (siehe awwwards `art-direction.md`, Punkt 2). Muss durch Typografie und die Grafik getragen werden, nicht durch den Akzent. |

## Richtung B: Plan

**Idee in einem Satz:** Die Website ist ein Bauplan, der sich beim Scrollen zeichnet: aus losen Zetteln wird ein lesbarer Ablaufplan.

| | |
|---|---|
| Anker | Die Zielgruppe arbeitet mit Plänen, Zetteln, Auftragsmappen. Ein Plan ist ihr Dokument, kein Dashboard. |
| Palette | Papier `#F3F1EC` hellt bis `#FFFFFF` auf, Tusche `#121212`, gedimmt `#5F5F5A`, Signalrot `#E3461C` (Pakete, aktive Knoten, Nummern, CTA). |
| Knoten | Quadrate mit 1,5 px Kontur, Kanten gestrichelt in der Analyse, durchgezogen ab Struktur. Rasterlinien als dezentes Papierdetail (nicht im Mockup, geplant). |
| Motion-Verb | „Mit dem Lineal gezogen“: Linien zeichnen sich mit `stroke-dashoffset`, Knoten setzen sich mit einem kurzen Snap. |
| Signaturmoment | Zustand 3: Die Zettel rasten in Spalten ein, die Verbindungen werden gezogen, der Plan ist fertig. |
| Screenshot-Frame | Papierweiß, schwere schwarze Headline links, rechts ein sauber gezeichneter Ablaufplan mit zwei roten Paketen. |
| Markenwirkung | Editorial, ruhig, vertrauenswürdig. Hebt sich von allen KI-Agentur-Seiten ab. Wirkt „gedruckt“, nicht „gerendert“. |
| Umsetzbarkeit | Hoch. Gleiche Technik wie A, nur andere Tokens. OG-Bild und Favicon müssen neu gesetzt werden (hell). |
| Performance | Sehr gut. |
| Bedienbarkeit | Sehr gut für Text: Tusche auf Papier 16,6:1, gedimmt 5,7:1. Das Signalrot erreicht auf Papier nur 3,6:1 und taugt damit für Grafik, Buttons mit weißer Schrift und große Schrift, nicht für die kleinen roten Nummern im Mockup. In Phase 04 wird dafür ein dunkleres Rot festgelegt oder die Nummern werden in Tusche gesetzt. |
| Risiko | Entfernt sich am weitesten von V5 und vom Wort „cinematic“; Tiefe muss über Zeichnung, Masken und Schatten entstehen, nicht über Licht. Dunkelmodus wäre ein zweites Design. |

## Richtung C: Tiefe

**Idee in einem Satz:** Die Website ist ein Raum, in dem der Ablauf aus der Unschärfe nach vorn kommt und scharf wird.

| | |
|---|---|
| Anker | Das Versprechen des Master-Prompts: räumliche Tiefe, cinematic transitions, von Unordnung zu Klarheit. |
| Palette | Nachtblau `#0A0F1A` hellt bis `#1B2436` auf, Text `#E8ECF2`, gedimmt `#8A94A6`, warmes Licht `#FFB454` (nur aktive Knoten, Pakete, CTA). |
| Knoten | Kreise, aktive Knoten mit weichem Lichtschein (einziger Glow, bewusst). Kanten weich geschwungen. |
| Motion-Verb | „Kommt in den Fokus“: Ebenen bewegen sich mit unterschiedlicher Geschwindigkeit (Parallax), weiche Unschärfe im Hintergrund, Schärfe auf dem aktiven Teil. |
| Signaturmoment | Übergang Komplexität zu Analyse: die verstreuten Punkte schließen sich wie ein Objektiv, das scharf stellt. |
| Screenshot-Frame | Nachtblau, Kreislauf der 14 Knoten, drei davon warm beleuchtet, Headline links. |
| Markenwirkung | Cinematic, ruhig, hochwertig. Weniger „Tech“, mehr „Werkstatt bei Nacht“. |
| Umsetzbarkeit | Mittel. Parallax-Ebenen und Blur kosten Frames auf schwachen Handys; Blur muss auf dem Handy abgeschaltet werden. |
| Performance | Gut, mit Einschränkung: `filter: blur` und `drop-shadow` auf vielen Elementen sind teuer. Begrenzen auf maximal drei aktive Knoten. |
| Bedienbarkeit | Gut. Warmes Licht auf Nachtblau 10,9:1, gedimmt 6,3:1. |
| Risiko | Nähe zu „generischer Tech-Look mit Glow“, den der Master-Prompt ausschließt. Nur haltbar, wenn Glow auf das aktive Element beschränkt bleibt. |

## Vergleich

Skala 1 bis 5, höher ist besser. Portabilität: könnte eine andere Firma dieselbe Seite nehmen? Niedriger ist besser.

| Kriterium | A Signal | B Plan | C Tiefe |
|---|---|---|---|
| Originalität | 2 | 4 | 3 |
| Passung zur Zielgruppe (Handwerk, Praxis, Hausverwaltung) | 3 | 5 | 3 |
| Passung zum Master-Prompt (minimalistisch, editorial, geometrisch, Tiefe) | 4 | 4 | 4 |
| Umsetzbarkeit auf V5-Basis | 5 | 4 | 3 |
| Performance mobil | 5 | 5 | 3 |
| Bedienbarkeit, Lesbarkeit | 4 | 5 | 4 |
| Portabilität (niedriger ist besser) | 4 | 2 | 4 |
| Summe (Portabilität invertiert) | 25 | 31 | 24 |

## Empfehlung

**Richtung B „Plan“**, mit einem Detail aus C: der Übergang von Komplexität zu Analyse darf einen Fokus-Effekt bekommen (Unschärfe nur auf den verstreuten Fragmenten, nie auf Text).

Begründung in drei Sätzen: B ist die einzige Richtung, die den Genericness-Test besteht; weder „dunkel plus Acid-Akzent“ noch „dunkel plus Glow“ würde ein Besucher Smart Flow zuordnen. B spricht die tatsächliche Zielgruppe in deren Material an (ein Plan, keine Platine) und ist bei Tageslicht und auf Baustellen am besten lesbar. Technisch ist B so günstig wie A und braucht keinen Gerätefallback.

Was gegen B spricht, ehrlich: Es ist die größte Abkehr vom bisherigen dunklen V5-Look, und „cinematic“ muss hier über Zeichnung, Masken, Tempo und Typografie entstehen, nicht über Licht. Wer die dunkle Bühne will, nimmt A; dann muss der Akzent noch sparsamer sitzen als im Mockup.

**Offen für Leon:** Richtung wählen (A, B oder C), oder B mit Anpassungen (zum Beispiel andere Signalfarbe statt Rot, etwa ein tiefes Blau `#1F3CFF` oder ein Grün, sobald das neue Logo da ist). Die Farbe des Akzents sollte am Ende zum nachgelieferten Logo passen; alles andere ist davon unabhängig.
