import { defineConfig, devices } from '@playwright/test';

const isCi: boolean = !!process.env['CI'];

export default defineConfig({
  testDir: './packages/components/src',
  testMatch: '**/*.component.e2e.ts',
  reporter: [['list'], ['html', { outputFolder: 'playwright-e2e-report', open: 'never' }]],
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 1 : undefined,
  use: {
    ...devices['Desktop Chrome'],
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
    screenshot: 'off',
  },
});
