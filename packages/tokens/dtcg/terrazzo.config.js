import { defineConfig } from '@terrazzo/cli';
import css from '@terrazzo/plugin-css';

export default defineConfig({
  tokens: './tokens-bruecke/tokens.json',
  plugins: [
    css({
      filename: 'tokens.css',
      variableName: (id) => id.replace(/\./g, '-'),
      baseSelector: ':root',
      baseScheme: 'light dark', // Optional: support both light and dark themes
    }),
  ],
});
