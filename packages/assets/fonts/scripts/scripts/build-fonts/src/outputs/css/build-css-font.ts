import { transform } from 'lightningcss';
import crypto from 'node:crypto';
import { dirname, join } from 'node:path';
import { readJsonFile } from '../../../../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { toDashCase } from '../../../../../../../../../scripts/helpers/misc/case/to-dash-case/to-dash-case.ts';
import { fontDescriptionSchema } from '../../../../../shared/font-description/font-description.schema.ts';
import type { FontDescription } from '../../../../../shared/font-description/font-description.ts';
import { fontVariantToCss } from '../../../../../shared/font-description/font-variant/to/css/font-variant-to-css.ts';
import { fontVariantToFileName } from '../../../../../shared/font-description/font-variant/to/file-name/font-variant-to-file-name.ts';
import { fontVariantToWoff2 } from '../../../../../shared/font-description/font-variant/to/woff2/font-variant-to-woff2.ts';

export interface BuildCssFontOptions {
  readonly sourceFile: string; // JSON path
  readonly fontDescription?: FontDescription;
  readonly outputDirectory: string;
  readonly serverURL: string;
  readonly logger: Logger;
}

export async function buildCssFont({
  sourceFile,
  fontDescription,
  outputDirectory,
  serverURL,
  logger,
}: BuildCssFontOptions): Promise<void> {
  fontDescription ??= fontDescriptionSchema.parse(await readJsonFile(sourceFile));

  return logger.asyncTask('css', async (logger: Logger): Promise<void> => {
    const { family, variants }: FontDescription = fontDescription;

    const baseName: string = toDashCase(family);

    let css: string = '';

    for (const fontVariant of variants) {
      const variantName: string = fontVariantToFileName(fontVariant);

      await logger.asyncTask(`variant: ${variantName}`, async (logger: Logger): Promise<void> => {
        const woff2: Uint8Array = await logger.asyncTask('to-woff2', (): Promise<Uint8Array> =>
          fontVariantToWoff2(fontVariant, {
            cwd: dirname(sourceFile),
          }),
        );

        const hash: string = crypto.createHash('md5').update(woff2).digest('base64url');

        const woff2FileName: string = `${baseName}.${variantName}.${hash}.woff2`;

        await writeFileSafe(join(outputDirectory, woff2FileName), woff2);

        const src = new URL(`./${woff2FileName}`, serverURL);

        css +=
          fontVariantToCss(fontVariant, {
            family,
            display: 'swap',
            src: `url(${JSON.stringify(src.toString())}) format('woff2');`,
          }) + `\n\n`;
      });
    }

    const { code, map } = transform({
      filename: `${baseName}.css`,
      code: new TextEncoder().encode(css),
      minify: true,
      sourceMap: true,
    });

    await Promise.all([
      writeFileSafe(join(outputDirectory, `${baseName}.css`), css),
      writeFileSafe(join(outputDirectory, `${baseName}.min.css`), code),
      writeFileSafe(join(outputDirectory, `${baseName}.min.css.map`), map!),
    ]);
  });
}
