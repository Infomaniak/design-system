import { rm } from 'node:fs';
import { glob } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import StyleDictionary from 'style-dictionary';
import { formats } from 'style-dictionary/enums';
import { registerStyleDictionaryThemeFilter } from './src/styled-dictionary/filters/register-style-dictionary-theme-filter.ts';
import { DTCG_CSS_TRANSFORMS } from './src/styled-dictionary/transforms/css/dtcg-css-transforms.ts';
import { registerDtcgCssStyleDictionaryTransform } from './src/styled-dictionary/transforms/css/register-dtcg-css-style-dictionary-transform.ts';

registerDtcgCssStyleDictionaryTransform();
registerStyleDictionaryThemeFilter();

async function debug(): Promise<void> {
  const sd = new StyleDictionary({
    log: {
      verbosity: 'verbose',
    },
    include: [
      // 'tokens/t1-primitive/color.tokens.json',
      // 'tokens/t1-primitive/radius.tokens.json',
      // 'tokens/t1-primitive/test.tokens.json',
      'tokens/t1-primitive/**/*.json',
      'tokens/t2-semantic/**/*.json',
      'tokens/t3-component/**/*.json',
    ],
    source: [`tokens/themes/full/light.tokens.json`],
    // source: [`tokens/themes/products/mail.tokens.json`],
    // parsers: ['json-parser'],
    platforms: {
      css: {
        expand: {
          // include: ['typography'],
          // include: ['strokeStyle', 'border', 'transition', 'shadow', 'gradient', 'typography'],
        },
        buildPath: 'dist/',
        prefix: 'ikds-',
        transforms: [...DTCG_CSS_TRANSFORMS],
        files: [
          {
            destination: 'light.css',
            format: formats.cssVariables,
            filter: 'theme-filter',
            options: {
              outputReferences: true,
              selector: ':root',
            },
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}

async function main(): Promise<void> {
  const distPath: string = 'dist';
  // TODO
  await rm(distPath, { force: true, recursive: true });

  for await (const entry of glob('tokens/themes/**/*.tokens.json')) {
    // console.log(entry);

    const name: string = basename(entry, '.tokens.json');

    const outputDir: string = join(distPath, dirname(entry).slice('tokens/themes/'.length));

    const isPatch: boolean = name.endsWith('.patch');

    const sd = new StyleDictionary({
      log: {
        verbosity: 'verbose',
      },
      include: [
        'tokens/t1-primitive/**/*.tokens.json',
        'tokens/t2-semantic/**/*.tokens.json',
        'tokens/t3-component/**/*.tokens.json',
      ],
      source: [entry],
      platforms: {
        css: {
          buildPath: outputDir,
          prefix: 'ikds-',
          transforms: [...DTCG_CSS_TRANSFORMS],
          files: [
            {
              destination: `${name}.css`,
              format: formats.cssVariables,
              filter: isPatch ? 'theme-filter' : undefined,
              options: {
                outputReferences: true,
                selector: ':root',
              },
            },
            {
              destination: `${name}.attr.css`,
              format: formats.cssVariables,
              filter: isPatch ? 'theme-filter' : undefined,
              options: {
                outputReferences: true,
                selector: `[data-theme="${isPatch ? name.slice(0, -'.patch'.length) : name}"]`,
              },
            },
          ],
        },
      },
    });

    await sd.buildAllPlatforms();
  }
}

main();
