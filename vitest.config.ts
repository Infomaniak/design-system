import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { viteTc39DecoratorsPlugin } from './plugins/vite-tc39-decorators-plugin.ts';

const ROOT_DIR: string = dirname(fileURLToPath(import.meta.url));
// @ts-expect-error: the code is currently commented out
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STORYBOOK_DIR: string = join(ROOT_DIR, 'apps/docs');

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  build: {
    target: 'es2022',
  },
  test: {
    // dir: 'src',
    dir: '.',
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        settings: {
          // Unit tests must not perform real navigations: clicking an anchor
          // whose default action is not prevented would otherwise fetch the
          // URL in a child page (e.g. a dev server running on localhost:3000,
          // the environment default). With navigation disabled, happy-dom
          // falls back to updating the URL only.
          navigation: {
            disableMainFrameNavigation: true,
            disableChildFrameNavigation: true,
            disableChildPageNavigation: true,
          },
        },
      },
    },
    setupFiles: ['./apps/docs/src/test.setup.ts'],
    server: {
      deps: {
        // Ships extensionless relative imports that Node's ESM resolver rejects.
        inline: ['@material/material-color-utilities'],
      },
    },
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/visual-regression/**',
      '**/*.component.e2e.ts',
      'playwright.config.ts',
      'playwright.vr.config.ts',
    ],
    coverage: {
      provider: 'istanbul',
      // include: ['src/**/*.ts'],
      include: ['./**/*.ts'],
      exclude: [
        '**/*.d.ts',
        'src/**/*.{test,bench}.ts',
        'src/**/*.skip-test*.ts',
        'src/**/*.skip-test*/**/*.ts',
        '**/dist/**',
        'node_modules/**/*',
        '**/*.e2e.ts',
        '**/*.e2e-spec.ts',
        '**/*.component.e2e.ts',
        '**/tests/visual-regression/**',
        'playwright.config.ts',
        'playwright.vr.config.ts',
        'playwright-vr-results.json',
        'playwright-vr-results-metadata.json',
        'playwright-vr-report/**',
        'playwright-e2e-report/**',
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
  plugins: [viteTc39DecoratorsPlugin()],
});
