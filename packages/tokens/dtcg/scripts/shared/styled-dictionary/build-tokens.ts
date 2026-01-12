import { glob, rm } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import StyleDictionary from 'style-dictionary';
import { formats } from 'style-dictionary/enums';
import { registerStyleDictionaryThemeFilter } from './filters/register-style-dictionary-theme-filter.ts';
import { DTCG_CSS_TRANSFORMS } from './transforms/css/dtcg-css-transforms.ts';
import { registerDtcgCssStyleDictionaryTransform } from './transforms/css/register-dtcg-css-style-dictionary-transform.ts';

async function debug(): Promise<void> {
  const sd = new StyleDictionary({
    log: {
      verbosity: 'verbose',
    },
    include: ['tokens/base/**/*.json'],
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

export interface BuildTokensOptions {
  readonly sourceBaseTokenDirectory: string;
  readonly sourceThemesDirectory: string;
  readonly outputDirectory: string;
}

export async function buildTokens({
  sourceBaseTokenDirectory,
  sourceThemesDirectory,
  outputDirectory,
}: BuildTokensOptions): Promise<void> {
  // await debug();
  // return;

  if (sourceBaseTokenDirectory.endsWith('/')) {
    sourceBaseTokenDirectory = sourceBaseTokenDirectory.slice(0, -1);
  }

  if (sourceThemesDirectory.endsWith('/')) {
    sourceThemesDirectory = sourceThemesDirectory.slice(0, -1);
  }

  registerDtcgCssStyleDictionaryTransform();
  registerStyleDictionaryThemeFilter();

  await rm(outputDirectory, { force: true, recursive: true });

  for await (const entry of glob(`${sourceThemesDirectory}/**/*.tokens.json`)) {
    const buildPath: string = join(
      outputDirectory,
      relative(sourceThemesDirectory, dirname(entry)),
    );

    const name: string = basename(entry, '.tokens.json');

    const isPatch: boolean = name.endsWith('.patch');

    const attributeName: string = isPatch ? name.slice(0, -'.patch'.length) : name;

    const sd = new StyleDictionary({
      log: {
        verbosity: 'verbose',
      },
      include: [`${sourceBaseTokenDirectory}/**/*.tokens.json`],
      source: [entry],
      platforms: {
        css: {
          buildPath,
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
                selector: `[data-theme="${attributeName}"],\n[data-variant="${attributeName}"]`,
              },
            },
          ],
        },
      },
    });

    // console.log(await sd.getPlatformTokens('css'));

    await sd.buildAllPlatforms();
  }
}
