import { defineConfig, devices } from '@playwright/test'

// Dev-Server, nicht Production: window.__sf.progress gibt es nur in der Entwicklung (ScrollProvider).
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
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: /mobile\.spec\.ts/ },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: /mobile\.spec\.ts/ },
    { name: 'mobile', use: { ...devices['iPhone 13'] }, testMatch: /(mobile|smoke|motion)\.spec\.ts/ },
  ],
})
