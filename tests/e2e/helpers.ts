import { expect, type Page } from '@playwright/test'

/** Scrollfortschritt 0..1 aus dem Dev-Hook des ScrollProviders (nur `next dev`). */
export function progress(page: Page): Promise<number> {
  return page.evaluate(() => window.__sf?.progress ?? Number.NaN)
}

/** Wartet, bis der ScrollProvider gestartet ist und window.__sf bereitsteht. */
export async function waitForScroll(page: Page): Promise<void> {
  await page.waitForFunction(() => window.__sf !== undefined)
}

/** Wartet, bis der Fortschritt `expected` auf `tolerance` genau erreicht hat. */
export async function expectProgressNear(page: Page, expected: number, tolerance = 0.01): Promise<void> {
  await expect.poll(async () => Math.abs((await progress(page)) - expected), { timeout: 10_000 }).toBeLessThan(tolerance)
}
