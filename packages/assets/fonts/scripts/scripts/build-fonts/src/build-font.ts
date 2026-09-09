import { join } from 'node:path';
import { readJsonFile } from '../../../../../../../scripts/helpers/file/read-json-file.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { fontDescriptionSchema } from '../../../shared/font-description/font-description.schema.ts';
import type { FontDescription } from '../../../shared/font-description/font-description.ts';
import { buildCssFont } from './outputs/css/build-css-font.ts';

export interface BuildFontOptions {
  readonly sourceFile: string; // JSON path
  readonly outputDirectory: string;
  readonly serverURL: string;
  readonly logger: Logger;
}

export async function buildFont({
  sourceFile,
  outputDirectory,
  serverURL,
  logger,
}: BuildFontOptions): Promise<void> {
  outputDirectory = removeTrailingSlash(outputDirectory);
  const fontDescription: FontDescription = fontDescriptionSchema.parse(
    await readJsonFile(sourceFile),
  );

  return logger.asyncTask(
    `font: ${fontDescription.family}`,
    async (logger: Logger): Promise<void> => {
      await buildCssFont({
        sourceFile,
        fontDescription,
        outputDirectory: join(outputDirectory, 'web'),
        serverURL,
        logger,
      });
    },
  );
}
