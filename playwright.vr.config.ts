import { defineConfig, devices } from '@playwright/test';

const isCi: boolean = !!process.env['CI'];
const prStorybookUrl: string = process.env['VR_STORYBOOK_URL'] ?? 'http://localhost:6006';
const developStorybookUrl: string =
  process.env['VR_DEVELOP_URL'] ?? 'https://infomaniak.github.io/design-system/storybook/develop';

export default defineConfig({
  testDir: './packages/components/tests/visual-regression',
  snapshotDir: './packages/components/tests/visual-regression/__screenshots__',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-vr-report', open: 'never' }],
    ['json', { outputFile: 'playwright-vr-results.json' }],
  ],
  fullyParallel: false,
  forbidOnly: isCi,
  retries: 0,
  workers: isCi ? 1 : undefined,
  use: {
    ...devices['Desktop Chrome'],
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
    screenshot: 'off',
  },
  metadata: {
    prStorybookUrl,
    developStorybookUrl,
  },
});
