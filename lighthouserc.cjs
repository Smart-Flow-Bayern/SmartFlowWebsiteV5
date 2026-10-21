// Lighthouse CI, mobil (Default-Emulation). Desktop: lighthouserc.desktop.cjs.
// Chrome-Pfad bei Bedarf per CHROME_PATH setzen, nicht hier festschreiben.
// Die Chrome-Flags erzwingen WebGL per SwiftShader (Software-Rendering, deutlich langsamer als echte GPU).
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start -p 3006',
      startServerReadyPattern: 'Ready',
      url: ['http://localhost:3006/'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/mobile' },
  },
}
