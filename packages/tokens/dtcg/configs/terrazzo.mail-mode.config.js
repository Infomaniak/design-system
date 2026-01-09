import { defineConfig } from '@terrazzo/cli';
import css from '@terrazzo/plugin-css';

export default defineConfig({
  tokens: './resolvers/mail.resolver.json',
  outDir: 'formats',
  plugins: [
    css({
      filename: 'mail-mode.css',
      variableName: (token) => `--ikds-${token.id.replace(/\./g, '-').toLowerCase()}`,
      baseSelector: `[data-color-mode="mail"]`,
    }),
  ],
});
