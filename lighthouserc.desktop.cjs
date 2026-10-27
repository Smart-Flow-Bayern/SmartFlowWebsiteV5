// Lighthouse CI, Desktop-Preset. Siehe lighthouserc.cjs für Hinweise.
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm preview',
      startServerReadyPattern: 'Accepting connections',
      url: ['http://localhost:3006/'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
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
