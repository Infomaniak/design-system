import ttf2woff2 from '@0x6b/ttf2woff2-wasm';
import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { readJsonFile } from '../../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeFileSafe } from '../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { fontFaceSchema } from '../../../shared/font-description/__v1/font-face.schema.ts';
import type { FontFaceDefinition } from '../../../shared/font-description/__v1/font-face.ts';
import { fontFaceToCss } from '../../../shared/font-description/__v1/to/css/font-face-to-css.ts';

export interface BuildFontOptions {
  readonly sourceFile: string; // JSON path
  readonly outputDirectory: string;
  readonly serverURL: string;
  readonly logger: Logger;
}

export function buildFont({
  sourceFile,
  outputDirectory,
  serverURL,
  logger,
}: BuildFontOptions): Promise<void> {
  outputDirectory = removeTrailingSlash(outputDirectory);
  const fileName: string = basename(sourceFile, '.json');

  return logger.asyncTask(`build-font[${fileName}]`, async (): Promise<void> => {
    const fontFace: FontFaceDefinition = fontFaceSchema.parse(
      await readJsonFile(sourceFile),
    ) as FontFaceDefinition;

    const woff2: Uint8Array = ttf2woff2(
      await readFile(join(dirname(sourceFile), `${fileName}.ttf`)),
    );

    const hash: string = crypto.createHash('md5').update(woff2).digest('base64url');

    const woff2FileName: string = `${fileName}.${hash}.woff2`;
    const cssFileName: string = `${fileName}.css`;

    const src = new URL(`./${cssFileName}`, serverURL);

    await Promise.all([
      writeFileSafe(join(outputDirectory, woff2FileName), woff2),
      writeFileSafe(
        join(outputDirectory, cssFileName),
        fontFaceToCss({
          fontDisplay: 'swap',
          ...fontFace,
          src: `url(${src.toString()}) format('woff2');`,
        }),
      ),
    ]);
  });
}
