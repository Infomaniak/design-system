import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { writeJsonFileSafe } from '../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { writeTextFileSafe } from '../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { ICON_NAME_PATTERN } from '../icons/icon-name.ts';
import type { SvgOutlinePath } from '../icons/outline-path.ts';
import { buildSymbolSvg } from './build-symbol-svg.ts';
import type { SymbolTemplate } from './parse-symbol-template.ts';
import { SYMBOL_NAME_PREFIX, SYMBOLS_XCASSETS_DIRECTORY_NAME } from './sf-symbols-config.ts';

export interface SymbolIcon {
  readonly name: string;
  readonly outlinedPaths: readonly SvgOutlinePath[];
}

export interface BuildSymbolsXcassetsOptions {
  readonly outputDirectory: string;
  readonly template: SymbolTemplate;
  readonly icons: readonly SymbolIcon[];
  readonly logger: Logger;
}

export async function buildSymbolsXcassets({
  outputDirectory,
  template,
  icons,
  logger,
}: BuildSymbolsXcassetsOptions): Promise<void> {
  await logger.asyncTask('build-symbols-xcassets', async (logger: Logger): Promise<void> => {
    validateIcons(icons);

    const xcassetsDirectory: string = join(outputDirectory, SYMBOLS_XCASSETS_DIRECTORY_NAME);
    await mkdir(xcassetsDirectory, { recursive: true });
    await writeJsonFileSafe(join(xcassetsDirectory, 'Contents.json'), {
      info: { author: 'xcode', version: 1 },
    });

    for (const icon of icons) {
      const symbolName: string = `${SYMBOL_NAME_PREFIX}${icon.name}`;
      const symbolsetDirectory: string = join(xcassetsDirectory, `${symbolName}.symbolset`);
      await mkdir(symbolsetDirectory, { recursive: true });
      await writeJsonFileSafe(
        join(symbolsetDirectory, 'Contents.json'),
        buildSymbolsetContents(symbolName),
      );
      await writeTextFileSafe(
        join(symbolsetDirectory, `${symbolName}.symbol.svg`),
        buildSymbolSvg({ symbolName, outlinedPaths: icon.outlinedPaths, template }),
      );
      logger.info(`Built ${JSON.stringify(`${symbolName}.symbolset`)}.`);
    }
  });
}

function validateIcons(icons: readonly SymbolIcon[]): void {
  const seenNames: Set<string> = new Set();

  for (const { name, outlinedPaths } of icons) {
    if (!ICON_NAME_PATTERN.test(name)) {
      throw new Error(`Invalid icon name ${JSON.stringify(name)}.`);
    }
    if (seenNames.has(name)) {
      throw new Error(`Duplicated icon name ${JSON.stringify(name)}.`);
    }
    if (outlinedPaths.length === 0) {
      throw new Error(`Icon ${JSON.stringify(name)} has no outline paths.`);
    }
    seenNames.add(name);
  }
}

function buildSymbolsetContents(symbolName: string): Record<string, unknown> {
  return {
    info: { author: 'xcode', version: 1 },
    symbols: [
      {
        filename: `${symbolName}.symbol.svg`,
        idiom: 'universal',
      },
    ],
  };
}
