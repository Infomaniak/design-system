import { defineConfig } from '@terrazzo/cli';
import css from '@terrazzo/plugin-css';
import tailwind from '@terrazzo/plugin-tailwind';

export default defineConfig({
  tokens: './src/tokens.json',
  outDir: 'formats',
  plugins: [
    css({
      filename: 'tokens.css',
      variableName: (token) => `--ikds-${token.id.replace(/\./g, '-').toLowerCase()}`,
    }),
    tailwind({
      filename: 'tailwind.css',
      // theme: {
      //   ds: ['TailwindCSS.*', 'Typography-styles.*', 'Grid-styles.*', 'Effect-styles.*'],
      // },
      theme: {
        /** @see https://tailwindcss.com/docs/configuration#theme */
        color: ['TailwindCSS.color.*'],
        font: ['TailwindCSS.font.*'],
        spacing: ['TailwindCSS.spacing.*'],
        radius: ['TailwindCSS.radius.*'],
        text: ['Typography-styles.text-*'],
      },
    }),
  ],
});
