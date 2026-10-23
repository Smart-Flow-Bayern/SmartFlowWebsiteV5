/**
 * Jahr für die Fußzeile im Server-Render (auch ohne JavaScript sichtbar). Das Build-Jahr kommt aus
 * next.config.ts (`env.BUILD_YEAR`), damit die Seite statisch bleibt (new Date() im Prerender verlangt unter
 * cacheComponents einen Cache-Eintrag mit Neuvalidierung). Nach der Hydration zeigt der Footer das aktuelle Jahr.
 */
export function buildYear(): number {
  const year = Number(process.env.BUILD_YEAR)
  return Number.isInteger(year) && year > 2000 ? year : new Date().getFullYear()
}
