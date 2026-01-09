import { defineConfig } from '@terrazzo/cli';
import css from '@terrazzo/plugin-css';

export default defineConfig({
  tokens: './resolvers/light.resolver.json',
  outDir: 'dist',
  plugins: [
    css({
      filename: 'light-mode.css',
      variableName: (token) => `--ikds-${token.id.replace(/\./g, '-').toLowerCase()}`,
      baseSelector: `[data-color-mode="light"]`,
    }),
  ],
});
