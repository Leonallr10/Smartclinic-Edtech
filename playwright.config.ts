import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.E2E_BASE_URL?.trim() || 'https://smartclinic-edtech.vercel.app';

/**
 * E2E against the deployed app by default (CI-friendly).
 * Override with E2E_BASE_URL=http://localhost:3000 for local runs.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
