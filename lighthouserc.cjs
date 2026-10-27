// Lighthouse CI, mobil (Default-Emulation). Desktop: lighthouserc.desktop.cjs.
// Chrome-Pfad bei Bedarf per CHROME_PATH setzen, nicht hier festschreiben.
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm preview',
      startServerReadyPattern: 'Accepting connections',
      url: ['http://localhost:3006/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/mobile' },
  },
}
