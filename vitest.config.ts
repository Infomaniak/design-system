import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const ROOT_DIR: string = dirname(fileURLToPath(import.meta.url));
// @ts-expect-error: the code is currently commented out
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STORYBOOK_DIR: string = join(ROOT_DIR, 'apps/docs');

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
    // TODO: Enable this once we have a Storybook config that uses Vitest
    // projects: [
    //   {
    //     extends: true,
    //     plugins: [
    //       // The plugin will run tests for the stories defined in your Storybook config
    //       // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
    //       storybookTest({
    //         configDir: join(STORYBOOK_DIR, '.storybook'),
    //       }),
    //     ],
    //     test: {
    //       name: 'storybook',
    //       browser: {
    //         enabled: true,
    //         headless: true,
    //         provider: playwright({}),
    //         instances: [
    //           {
    //             browser: 'chromium',
    //           },
    //         ],
    //       },
    //       setupFiles: ['apps/docs/.storybook/vitest.setup.ts'],
    //     },
    //   },
    // ],
  },
});
