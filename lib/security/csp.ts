// Content-Security-Policy als <meta>-Tag (GitHub Pages setzt keine eigenen Header).
// frame-ancestors wirkt im <meta>-Tag nicht und fehlt deshalb.
// Nur im Production-Build: `next dev` braucht 'unsafe-eval' (React-Callstacks, HMR).
// Cal.com lädt erst nach Klick.
export const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://cal.com https://*.cal.com",
  "frame-src https://cal.com https://*.cal.com",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')
