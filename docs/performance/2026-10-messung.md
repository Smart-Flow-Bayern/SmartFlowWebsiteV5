# Performance-Messung 2026-10-21

Stand: Task 22 abgeschlossen, 2026-10-21. Alle Werte sind unverändert aus den Läufen übernommen. Nicht erreichte Ziele sind mit **verfehlt** markiert.

## Umgebung

- Gerät: MacBook mit Apple M4 Pro, macOS 26.6.2, Node 26.12, Next 16.4.2 (`next start`, Production-Build, Turbopack), Port 3006.
- Lighthouse: `@lhci/cli` 0.15.1 (Lighthouse-Kern darin gebündelt), je 3 Läufe, Median angegeben. Chrome: `/Applications/Google Chrome.app` über `CHROME_PATH`.
- **SwiftShader-Lauf** (`pnpm lighthouse`, `pnpm lighthouse:desktop`): Chrome-Flags `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`. WebGL wird per Software gerendert und belastet den Hauptthread stark. Mobil kommt die Lighthouse-Drosselung (4x CPU, simuliertes langsames 4G) hinzu. Diese Werte sind ein Worst Case und nicht repräsentativ für Besucher mit GPU.
- **Echt-Chrome-Lauf** (`lhci collect` mit `--headless=new`, ohne SwiftShader-Flags, Metal-GPU des Macs): gleiche Lighthouse-Emulation (mobil bzw. Desktop-Preset), aber echte GPU für WebGL.
- Frame-Zeiten: `pnpm measure:frames`, Playwright-Chromium headed (WebGL-Renderer laut Browser: ANGLE Metal, Apple M4 Pro), 3 s requestAnimationFrame mit Scroll in 10 Schritten von Progress 0 bis 1, drei Wiederholungen. Der Mac läuft mit 60 Hz, die Frame-Dauer ist daher auf 16,7 ms begrenzt.

## Ergebnisse

| Metrik | Ziel | Wert mobil | Wert Desktop | Umgebung |
|---|---|---|---|---|
| JS Startseite `/` und `/en`, initial, gzip | < 350 kB | 195 912 Bytes (ok) | gleich | Production-Build, `pnpm budget` |
| JS Startseite inkl. lazy geladener 3D-Szene (Three.js, R3F), gzip | < 350 kB (Wortlaut der Spec: „inkl. Three.js") | 464 361 Bytes, **verfehlt** | gleich | Production-Build, `pnpm budget` (informativ, nicht gated) |
| `public/models/computer.glb` | < 3 MB | 131 400 Bytes (ok) | gleich | Dateigröße |
| Lighthouse Performance, SwiftShader | mobil >= 70, Desktop >= 90 | 50 (Läufe 48, 50, 50), **verfehlt** | 68 (Läufe 70, 68, 68), **verfehlt** | SwiftShader, 2026-10-21 |
| Lighthouse Performance, echter Chrome (GPU) | mobil >= 70, Desktop >= 90 | 93 (Läufe 94, 92, 93), erreicht | 100 (Läufe 95, 100, 100), erreicht | `--headless=new`, Metal-GPU, 2026-10-21 |
| Lighthouse Accessibility | >= 95 | 100 | nicht gefordert, 100 | beide Umgebungen |
| Lighthouse Best Practices | >= 95 | 100 | nicht gefordert, 100 | beide Umgebungen |
| Lighthouse SEO | >= 95 | 100 | nicht gefordert, 100 | beide Umgebungen |
| FCP, Median | < 2 s auf simuliertem 4G | 753 ms (SwiftShader und echter Chrome) | 204 ms (Echt-Chrome-Median), 205 ms (SwiftShader-Median) | Lighthouse-Median |
| FCP, Bereich über alle Läufe | < 2 s auf simuliertem 4G | 753 bis 756 ms | 204 bis 207 ms | Lighthouse, 3 Läufe je Umgebung |
| LCP | keine Vorgabe | 4 756 ms (SwiftShader), 2 953 ms (echter Chrome) | 1 365 ms (SwiftShader), 541 ms (echter Chrome) | Lighthouse |
| TBT | keine Vorgabe | 2 629 ms (SwiftShader), 169 ms (echter Chrome) | 647 ms (SwiftShader), 0 ms (echter Chrome) | Lighthouse |
| CLS | keine Vorgabe | 0 | 0 | Lighthouse |
| Frame-Dauer Median | keine Vorgabe | 16,7 ms (390x844) | 16,7 ms (1440x900) | `pnpm measure:frames`, echte GPU |
| Frame-Dauer p95 | <= 33 ms | 17,3 / 17,5 / 17,5 ms (erreicht) | 17,5 / 17,0 / 17,3 ms (erreicht) | `pnpm measure:frames`, 3 Läufe |

Einschränkungen bei den Werten:

- Der erste Durchlauf von `measure:frames` für Desktop zeigte einmal einen Ausreißer von 117,5 ms (168 statt 180 Frames, Median und p95 unauffällig); die beiden folgenden Läufe hatten maximal 17,6 ms. Ein Kaltstart-Effekt ist wahrscheinlich, wurde aber nicht weiter untersucht.
- Der erste Echt-Chrome-Mobillauf direkt nach dem Start des Servers lag bei 51 (TBT 1 884 ms, Kaltstart); in der Messung nach dem Hebel lagen alle drei Läufe bei 92 bis 94.
- Im SwiftShader-Lauf fällt der Wert nicht „knapp" unter 70, sondern deutlich (50). Er sinkt vor allem durch Hauptthread-Zeit (TBT 2,6 s), die der Software-Renderer verursacht. Der Echt-Chrome-Lauf zeigt, dass das Ziel mit GPU erreicht wird.
- Die Zeile „inkl. lazy 3D" misst die Initial-Last plus alle Chunks, die davon (transitiv) per Dateiname referenziert werden. Three.js, React Three Fiber und GLTFLoader liegen darin. React/Next-Laufzeit (rund 120 kB gzip), GSAP/Lenis (rund 54 kB) und Three.js samt R3F (rund 265 kB) ergeben zusammen mehr als 350 kB. Die Grenze liegt damit unterhalb dessen, was die gewählte Bibliotheksbasis ohne Architekturumbau hergibt. Gated wird deshalb die Initial-Last, das Überschreiten der Summe ist als **verfehlt** ausgewiesen. Die Entscheidung, ob dieses Ziel bleibt, liegt beim Auftraggeber.

## Vorher/Nachher je Hebel

Hebel wurden nur gezogen, weil die Lighthouse-Schwellen im SwiftShader-Lauf rissen. Jeder Hebel wurde einzeln gemessen.

| Hebel | JS initial gzip `/` | JS inkl. lazy 3D gzip | Lighthouse mobil (SwiftShader) | Lighthouse Desktop (SwiftShader) | Ergebnis |
|---|---|---|---|---|---|
| Basis (Commit `0e2f093` plus Konfiguration) | 296 334 Bytes | 464 686 Bytes | 45 (43, 45, 45) | 65 (65, 65, 64) | Ausgangslage |
| 1. `scene/easing.ts` ohne three-Import; Stationstexte zogen über `scene/camera` den Three-Kern (rund 100 kB gzip) in den Start-Chunk (Commit `f4b2772`) | 195 912 Bytes | 464 361 Bytes | 50 (51, 50, 45) | 68 (68, 64, 68) | behalten, Initial-Last -34 %, Performance +5 bzw. +3 |
| 2. drei `useGLTF` durch `useLoader(GLTFLoader)` mit eingebettetem Meshopt-Decoder ersetzt | 195 913 Bytes | 463 655 Bytes | nicht gemessen | nicht gemessen | verworfen, Ersparnis 0,7 kB gzip rechtfertigt die Änderung nicht |

Nicht gezogen, weil nicht nötig oder nicht begründet:

- Modell-Hebel (Dreieckszahl, Quantisierung): Modell hat 131 kB, Grenze 3 MB.
- `dpr`-Obergrenze mobil: Frame-p95 liegt bei 17,5 ms, Ziel 33 ms.
- `frameloop="demand"`, `content-visibility` für Partikel: Architekturumbau ohne gemessenen Bedarf auf echter GPU.
- GSAP ist bereits per `gsap` und `gsap/ScrollTrigger` eingebunden; `three` wird überall mit Named Imports genutzt (`optimizePackageImports` für `three` und `@react-three/drei` ist gesetzt, Next 16 meldet dazu keine Warnung).

## Lighthouse auf der Preview

Steht aus: Es gibt noch keine Preview-URL (siehe `docs/abnahme/checkliste.md`). Werte für mobil und Desktop werden nach dem ersten Vercel-Preview-Build hier ergänzt.

## Reproduktion

```bash
pnpm build && pnpm budget
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
pnpm lighthouse           # mobil, SwiftShader, startet pnpm start -p 3006 selbst
pnpm lighthouse:desktop   # Desktop-Preset, SwiftShader
pnpm start -p 3006        # in einem zweiten Terminal, dann:
# Echter Chrome mit GPU (Server auf 3006 läuft), ohne SwiftShader-Flags. Gemessen wurde mit einer temporären Config
# (collect.url, numberOfRuns 3, settings.chromeFlags "--headless=new"), die diese Optionen setzt:
pnpm exec lhci collect --url=http://localhost:3006/ --numberOfRuns=3 --settings.chromeFlags="--headless=new"
# Desktop: zusätzlich --settings.preset=desktop
pnpm measure:frames       # Frame-Zeiten mit echter GPU, Fenster erscheint kurz
```

Die Budget-Grenzen lassen sich zum Testen des Exit-Codes per `BUDGET_JS_LIMIT` und `BUDGET_GLB_LIMIT` überschreiben. Next 16 mit Turbopack schreibt kein `app-build-manifest.json`; `scripts/check-budget.mjs` liest stattdessen die Skript-Tags der vorgerenderten Seiten in `.next/server/app/` (ohne `nomodule`-Polyfills) und folgt Chunk-Referenzen für die lazy geladene Szene.
