import { defineConfig } from 'vitest/config';

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
  },
});
