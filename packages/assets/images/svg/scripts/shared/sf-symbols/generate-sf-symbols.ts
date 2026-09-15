import { rm } from 'node:fs/promises';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { buildSymbolsXcassets, type SymbolIcon } from './build-symbols-xcassets.ts';
import { readSymbolTemplate } from './parse-symbol-template.ts';
import { readSymbolIcons } from './read-symbol-icons.ts';

export interface GenerateSfSymbolsOptions {
  /** Directory wiped and filled with the generated `ESDSSymbols.xcassets`. */
  readonly outputDirectory: string;
  readonly outlinesDirectory: string;
  readonly webIconsDirectory?: string;
  readonly logger: Logger;
}

/**
 * Wipes the output directory then generates the SF Symbols `.xcassets` from the committed outline
 * files and the Apple SF Symbols template.
 */
export async function generateSfSymbols({
  outputDirectory,
  outlinesDirectory,
  webIconsDirectory,
  logger,
}: GenerateSfSymbolsOptions): Promise<readonly SymbolIcon[]> {
  await rm(outputDirectory, { force: true, recursive: true });

  const template = await readSymbolTemplate();
  const icons = await readSymbolIcons({ outlinesDirectory, webIconsDirectory, logger });
  await buildSymbolsXcassets({ outputDirectory, template, icons, logger });

  return icons;
}
