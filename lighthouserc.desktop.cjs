// Lighthouse CI, Desktop-Preset. Siehe lighthouserc.cjs für Hinweise.
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start -p 3006',
      startServerReadyPattern: 'Ready',
      url: ['http://localhost:3006/'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        chromeFlags: '--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/desktop' },
  },
}
