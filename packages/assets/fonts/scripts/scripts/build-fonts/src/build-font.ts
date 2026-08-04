import crypto from 'node:crypto';
import { dirname, join } from 'node:path';
import { readJsonFile } from '../../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeFileSafe } from '../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { toDashCase } from '../../../../../../../scripts/helpers/misc/case/to-dash-case/to-dash-case.ts';
import { removeTrailingSlash } from '../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { fontDescriptionSchema } from '../../../shared/font-description/font-description.schema.ts';
import type { FontDescription } from '../../../shared/font-description/font-description.ts';
import { fontVariantToCss } from '../../../shared/font-description/font-variant/to/css/font-variant-to-css.ts';
import { fontVariantToFileName } from '../../../shared/font-description/font-variant/to/file-name/font-variant-to-file-name.ts';
import { fontVariantToWoff2 } from '../../../shared/font-description/font-variant/to/woff2/font-variant-to-woff2.ts';

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
  const { family, variants }: FontDescription = fontDescriptionSchema.parse(
    await readJsonFile(sourceFile),
  );

  const baseName: string = toDashCase(family);

  return logger.asyncTask(`build-font => ${baseName}`, async (): Promise<void> => {
    const cssFileName: string = `${baseName}.css`;
    let css: string = '';

    for (const fontVariant of variants) {
      const woff2: Uint8Array = await fontVariantToWoff2(fontVariant, {
        cwd: dirname(sourceFile),
      });

      const hash: string = crypto.createHash('md5').update(woff2).digest('base64url');

      const woff2FileName: string = `${baseName}.${fontVariantToFileName(fontVariant)}.${hash}.woff2`;

      await writeFileSafe(join(outputDirectory, woff2FileName), woff2);

      const src = new URL(`./${woff2FileName}`, serverURL);

      css +=
        fontVariantToCss(fontVariant, {
          family,
          display: 'swap',
          src: `url(${src.toString()}) format('woff2');`,
        }) + `\n\n`;
    }

    await writeFileSafe(join(outputDirectory, cssFileName), css);
  });
}
