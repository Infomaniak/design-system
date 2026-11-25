import { transform } from 'lightningcss';
import crypto, { randomUUID } from 'node:crypto';
import { cp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { readJsonFile } from '../../../../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { toDashCase } from '../../../../../../../../../scripts/helpers/misc/case/to-dash-case/to-dash-case.ts';
import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { toAbsolutePath } from '../../../../../../../../../scripts/helpers/path/to-absolute-path.ts';
import {
  type CenteredBandOverEdge,
  type CenteredBandUnderEdge,
  convertTtfContentToCenteredBand,
  offsetTtfContentToCenteredBand,
  opticalCenteringBandToFileNameSuffix,
  opticalCenteringOffsetToFileNameSuffix,
  toBandFamilySuffix,
  toOffsetFamilySuffix,
} from '../../../../../shared/converters/convert-ttf-content-to-centered-band.ts';
import { fontDescriptionSchema } from '../../../../../shared/font-description/font-description.schema.ts';
import type { FontDescription } from '../../../../../shared/font-description/font-description.ts';
import type { FontVariant } from '../../../../../shared/font-description/font-variant/font-variant.ts';
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

    const licenceFileName: string = `${baseName}.license.txt`;
    const licenceUrl: URL = new URL(`./${licenceFileName}`, serverURL);

    let css: string =
      fontDescription.license === undefined
        ? ''
        : dedent`
          /*
            LICENSE: ${fontDescription.license} (${licenceUrl.toString()})
          */
        ` + '\n\n';

    for (const fontVariant of variants) {
      const variantName: string = fontVariantToFileName(fontVariant);

      await logger.asyncTask(`variant: ${variantName}`, async (logger: Logger): Promise<void> => {
        await logger.asyncTask('default', async (): Promise<void> => {
          css +=
            (await fontVariantToWoff2AndCss({
              fontVariant,
              cwd: dirname(sourceFile),
              outputDirectory,
              family,
              baseName,
              variantName,
              serverURL,
            })) + '\n\n';
        });

        {
          // TODO: explore `ascent-override` when available on safari
          const offset: number = -0.5;
          const src: string = join(tmpdir(), `${randomUUID()}.ttf`);
          const newFamily: string = `${family} ${toOffsetFamilySuffix(offset)}`;

          const content: Uint8Array = offsetTtfContentToCenteredBand({
            input: await readFile(toAbsolutePath(fontVariant.src, dirname(sourceFile))),
            offset,
            family: newFamily,
            logger,
          });

          await writeFile(src, content);

          css +=
            (await fontVariantToWoff2AndCss({
              fontVariant: { ...fontVariant, src },
              cwd: dirname(src),
              outputDirectory,
              family: newFamily,
              baseName: `${baseName}.${opticalCenteringOffsetToFileNameSuffix(offset)}`,
              variantName,
              serverURL,
            })) + '\n\n';
        }

        for (const start of ['ex'] satisfies readonly CenteredBandOverEdge[]) {
          for (const end of ['alphabetic'] satisfies readonly CenteredBandUnderEdge[]) {
            await logger.asyncTask(`${start}-${end}`, async (logger: Logger): Promise<void> => {
              const src: string = join(tmpdir(), `${randomUUID()}.ttf`);
              const newFamily: string = `${family} ${toBandFamilySuffix(start, end)}`;

              const content: Uint8Array = convertTtfContentToCenteredBand({
                input: await readFile(toAbsolutePath(fontVariant.src, dirname(sourceFile))),
                start,
                end,
                family: newFamily,
                logger,
              });

              await writeFile(src, content);

              css +=
                (await fontVariantToWoff2AndCss({
                  fontVariant: { ...fontVariant, src },
                  cwd: dirname(src),
                  outputDirectory,
                  family: newFamily,
                  baseName: `${baseName}.${opticalCenteringBandToFileNameSuffix(start, end)}`,
                  variantName,
                  serverURL,
                })) + '\n\n';
            });
          }
        }
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

    // optionally copy the licenses
    for (const fileName of ['OFL.txt']) {
      try {
        await cp(join(dirname(sourceFile), fileName), join(outputDirectory, licenceFileName));
        break;
      } catch {
        // fail silently
      }
    }
  });
}

/*---*/

interface FontVariantToWoff2AndCssOptions {
  readonly fontVariant: FontVariant;
  readonly cwd?: string;
  readonly outputDirectory: string;
  readonly family: string;
  readonly baseName?: string;
  readonly variantName: string;
  readonly serverURL: string;
}

async function fontVariantToWoff2AndCss({
  fontVariant,
  cwd,
  outputDirectory,
  family,
  baseName = toDashCase(family),
  variantName,
  serverURL,
}: FontVariantToWoff2AndCssOptions): Promise<string> {
  const woff2: Uint8Array = await fontVariantToWoff2(fontVariant, {
    cwd,
  });

  const hash: string = crypto.createHash('md5').update(woff2).digest('base64url');

  const woff2FileName: string = `${baseName}.${variantName}.${hash}.woff2`;

  await writeFileSafe(join(outputDirectory, woff2FileName), woff2);

  const src: URL = new URL(`./${woff2FileName}`, serverURL);

  return fontVariantToCss(fontVariant, {
    family,
    display: 'swap',
    src: `url(${JSON.stringify(src.toString())}) format('woff2');`,
  });
}
