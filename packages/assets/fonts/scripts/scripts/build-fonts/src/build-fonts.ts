import { glob } from 'node:fs/promises';
import { removeTrailingSlash } from '../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { buildFont, type BuildFontOptions } from './build-font.ts';

export interface BuildFontsOptions extends Omit<BuildFontOptions, 'sourceFile'> {
  readonly sourceDirectory: string;
}

export async function buildFonts({
  sourceDirectory,
  ...options
}: BuildFontsOptions): Promise<void> {
  sourceDirectory = removeTrailingSlash(sourceDirectory);

  for await (const entry of glob(`${sourceDirectory}/**/*.json`)) {
    await buildFont({
      ...options,
      sourceFile: entry,
    });
  }
}
