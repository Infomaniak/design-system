import { defineConfig } from '@terrazzo/cli';
import css from '@terrazzo/plugin-css';
// import tailwind from '@terrazzo/plugin-tailwind';

export default defineConfig({
  tokens: './resolvers/ikds.resolver.json',
  // tokens: ['./tokens/t1-primitives/colors.tokens.json', './ikds.resolver.json'],
  outDir: 'formats',
  plugins: [
    css({
      filename: 'tokens.css',
      variableName: (token) => `--ikds-${token.id.replace(/\./g, '-').toLowerCase()}`,
      baseSelector: `:root`,
      modeSelectors: [
        {
          mode: 'light',
          selectors: [
            '@media (prefers-color-scheme: light)',
            // '[data-color-mode="light"][data-color-mode="light"]',
          ],
        },
        {
          mode: 'dark',
          selectors: [
            '@media (prefers-color-scheme: dark)',
            // '[data-color-mode="dark"][data-color-mode="dark"]',
          ],
        },
      ],
      // contextSelectors: [
      //   { selector: ':root', context: { theme: 'light' } },
      //   {
      //     selector: '@media (prefers-color-scheme: dark)',
      //     context: { theme: 'dark' },
      //   },
      // ],
      // utility: {
      //   bg: ['color.*'],
      // },
    }),
    // tailwind({
    //   filename: 'tailwind.css',
    //   // theme: {
    //   //   ds: ['TailwindCSS.*', 'Typography-styles.*', 'Grid-styles.*', 'Effect-styles.*'],
    //   // },
    //   theme: {
    //     /** @see https://tailwindcss.com/docs/configuration#theme */
    //     color: ['TailwindCSS.color.*'],
    //     font: ['TailwindCSS.font.*'],
    //     spacing: ['TailwindCSS.spacing.*'],
    //     radius: ['TailwindCSS.radius.*'],
    //     text: ['Typography-styles.text-*'],
    //   },
    // }),
  ],
});
