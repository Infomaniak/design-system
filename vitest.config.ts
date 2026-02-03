import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const ROOT_DIR: string = dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    // dir: 'src',
    dir: '.',
    coverage: {
      provider: 'istanbul',
      // include: ['src/**/*.ts'],
      include: ['./**/*.ts'],
      exclude: [
        'src/**/*.{test,bench}.ts',
        'src/**/*.skip-test*.ts',
        'src/**/*.skip-test*/**/*.ts',
      ],
      thresholds: {
        100: true,
      },
    },
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: join(ROOT_DIR, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['apps/docs/.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
