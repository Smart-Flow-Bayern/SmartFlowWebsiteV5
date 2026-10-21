# Hinweise zu Drittanbieter-Komponenten

## Schriften

Beide Schriften liegen lokal unter `public/fonts/` und werden unter der SIL Open Font License 1.1 (OFL 1.1) genutzt. Zur Laufzeit erfolgt kein Abruf bei Google Fonts.

### Schibsted Grotesk

- Copyright: Copyright 2023 The Schibsted-Grotesk Project Authors (https://github.com/schibsted/schibsted-grotesk)
- Lizenz: SIL Open Font License 1.1
- Quelle: npm-Paket `@fontsource-variable/schibsted-grotesk`, Version 5.3.0
- Datei: `public/fonts/schibsted-grotesk-latin-wght.woff2`

### JetBrains Mono

- Copyright: Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono)
- Lizenz: SIL Open Font License 1.1
- Quelle: npm-Paket `@fontsource-variable/jetbrains-mono`, Version 5.3.0
- Datei: `public/fonts/jetbrains-mono-latin-wght.woff2`
- Zusätzlich statische Instanz 600 als woff (für das OG-Bild, da Satori kein woff2 liest, und für `scripts/svg-text-to-path.mts`): npm-Paket `@fontsource/jetbrains-mono`, Version 5.3.0, Datei `public/fonts/jetbrains-mono-latin-600.woff`
- Die Wortmarken in `public/brand/` enthalten aus dieser Schrift abgeleitete Glyphen-Umrisse.

Den Volltext der SIL OFL 1.1 finden Sie unter https://openfontlicense.org.
