import { defineConfig } from '@terrazzo/cli';
import css from '@terrazzo/plugin-css';

export default defineConfig({
  tokens: './resolvers/dark.resolver.json',
  outDir: 'formats',
  plugins: [
    css({
      filename: 'dark.css',
      variableName: (token) => `--ikds-${token.id.replace(/\./g, '-').toLowerCase()}`,
      baseSelector: `:root`,
    }),
  ],
});
