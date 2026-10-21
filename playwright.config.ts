import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  retries: 0,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3005' },
  webServer: {
    command: 'pnpm dev --port 3005',
    url: 'http://localhost:3005',
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // WebGL im Headless-Modus
        launchOptions: {
          args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
        },
      },
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
})
