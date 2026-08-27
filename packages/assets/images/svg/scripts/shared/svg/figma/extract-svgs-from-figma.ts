import { join } from 'node:path';
import { getFigmaFile } from '../../../../../../../../scripts/helpers/figma/api/files/get-figma-file.ts';
import type { FigmaFile } from '../../../../../../../../scripts/helpers/figma/api/files/types/figma-file.ts';
import {
  type FigmaImagesRecord,
  getFigmaImages,
} from '../../../../../../../../scripts/helpers/figma/api/images/get-figma-images.ts';
import { writeJsonFileSafe } from '../../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { writeTextFileSafe } from '../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';

import { type FigmaSvgMetadata } from './figma-svg-metadata.ts';

export interface SVGToLoad {
  readonly id: string;
  readonly name: string;
  readonly metadata: FigmaSvgMetadata;
}

export type ResolveSvgsToLoad = (
  figmaFile: FigmaFile,
  logger: Logger,
) => readonly SVGToLoad[];

export type OnExtractedHook = (figmaFile: FigmaFile, logger: Logger) => Promise<void>;

export interface ExtractSvgsFromFigmaOptions {
  readonly outputDirectory: string;
  readonly figmaAPIToken: string;
  readonly figmaSourceFileKey: string;
  readonly geometry?: 'paths';
  readonly resolveSvgsToLoad: ResolveSvgsToLoad;
  readonly onExtracted?: OnExtractedHook;
  readonly logger: Logger;
}

const BATCH_SIZE = 10;

export async function extractSvgsFromFigma({
  outputDirectory,
  figmaAPIToken,
  figmaSourceFileKey,
  geometry,
  resolveSvgsToLoad,
  onExtracted,
  logger,
}: ExtractSvgsFromFigmaOptions): Promise<void> {
  return logger.asyncTask('extract-figma-svgs', async (logger: Logger): Promise<void> => {
    outputDirectory = removeTrailingSlash(outputDirectory);

    const figmaFile: FigmaFile = await logger.asyncTask(
      'get-figma-file',
      (): Promise<FigmaFile> => {
        return getFigmaFile({
          token: figmaAPIToken,
          file_key: figmaSourceFileKey,
          geometry,
        });
      },
    );

    await logger.asyncTask('extract-component-svgs', async (logger: Logger): Promise<void> => {
      const svgsToLoad: readonly SVGToLoad[] = resolveSvgsToLoad(figmaFile, logger);

      if (svgsToLoad.length === 0) {
        throw new Error('No svg to extract.');
      }

      logger.info(`Found ${svgsToLoad.length} icons to export`);

      const images: FigmaImagesRecord = await logger.asyncTask(
        'get-urls',
        async (): Promise<FigmaImagesRecord> => {
          return getFigmaImages({
            token: figmaAPIToken,
            file_key: figmaSourceFileKey,
            ids: svgsToLoad.map(({ id }: SVGToLoad): string => id),
          });
        },
      );

      await logger.asyncTask('store-svgs', async (): Promise<void> => {
        for (let i = 0; i < svgsToLoad.length; i += BATCH_SIZE) {
          const batch = svgsToLoad.slice(i, i + BATCH_SIZE);

          await Promise.all(
            batch.map(async ({ id, name, metadata }: SVGToLoad): Promise<void> => {
              await Promise.all([
                writeJsonFileSafe(join(outputDirectory, `${name}.metadata.json`), metadata),
                writeTextFileSafe(
                  join(outputDirectory, `${name}.svg`),
                  await fetchFigmaSvgAsset(images[id]),
                ),
              ]);
            }),
          );

          logger.info(`Stored ${Math.min(i + BATCH_SIZE, svgsToLoad.length)}/${svgsToLoad.length}`);
        }
      });
    });

    if (onExtracted !== undefined) {
      await onExtracted(figmaFile, logger);
    }
  });
}

export function extractIconName(name: string): string {
  const match: RegExpMatchArray | null = /^esds\/icon\/([a-z0-9-]+)\s*$/g.exec(name);

  if (match === null) {
    throw new Error(`Invalid icon name: ${JSON.stringify(name)}`);
  }

  return match[1];
}

async function fetchFigmaSvgAsset(url: string): Promise<string> {
  return (await fetch(url)).text();
}
