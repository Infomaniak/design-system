import { join } from 'node:path';
import { getFigmaFile } from '../../../../../../../../scripts/helpers/figma/api/files/get-figma-file.ts';
import type { FigmaComponent } from '../../../../../../../../scripts/helpers/figma/api/files/types/figma-component.ts';
import type { FigmaFile } from '../../../../../../../../scripts/helpers/figma/api/files/types/figma-file.ts';
import {
  type FigmaImagesRecord,
  getFigmaImages,
} from '../../../../../../../../scripts/helpers/figma/api/images/get-figma-images.ts';
import { writeJsonFileSafe } from '../../../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { writeTextFileSafe } from '../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { block } from '../../../../../../../../scripts/helpers/misc/block.ts';
import { removeTrailingSlash } from '../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';

import { type FigmaSvgMetadata } from './figma-svg-metadata.ts';

export interface ExtractSvgFilesFromFigmaDesignFileOptions {
  readonly outputDirectory: string;
  readonly figmaAPIToken: string;
  readonly figmaSourceFileKey: string;
  readonly logger: Logger;
}

/**
 * Extracts SVG files from a Figma design file, saving individual components as SVG files
 * along with their associated metadata.
 */
export function extractSvgFilesFromFigmaDesignFile({
  outputDirectory,
  figmaAPIToken,
  figmaSourceFileKey,
  logger,
}: ExtractSvgFilesFromFigmaDesignFileOptions): Promise<void> {
  return logger.asyncTask('extract-figma-svgs', async (logger: Logger): Promise<void> => {
    outputDirectory = removeTrailingSlash(outputDirectory);

    interface SVGToLoad {
      readonly id: string;
      readonly name: string;
      readonly metadata: FigmaSvgMetadata;
    }

    const svgsToLoad: readonly SVGToLoad[] = await logger.asyncTask(
      'extract-svgs',
      async (): Promise<readonly SVGToLoad[]> => {
        const figmaFile: FigmaFile = await getFigmaFile({
          token: figmaAPIToken,
          file_key: figmaSourceFileKey,
        });

        // TODO: DEBUG
        // await writeJsonFileSafe(join(outputDirectory, 'figma-file.json'), figmaFile);

        const svgsToLoad: SVGToLoad[] = [];

        // for each figma components
        for (const id in figmaFile.components) {
          const component: FigmaComponent = figmaFile.components[id];

          // skip non icon components
          if (!component.name.startsWith('esds/')) {
            continue;
          }

          // extract name
          let name: string;
          const match: RegExpMatchArray | null = /^esds\/icon\/([a-z0-9-]+)$/g.exec(component.name);

          if (match === null) {
            throw new Error(`Invalid name: ${JSON.stringify(component.name)}`);
          } else {
            name = match[1];
          }

          const parts: readonly string[] = component.description.split(/\s+/g);

          const tags: readonly string[] = parts
            .filter((input: string): boolean => {
              return input.startsWith('#');
            })
            .map((input: string): string => {
              return input.slice(1);
            });

          const projects: readonly string[] = parts
            .filter((input: string): boolean => {
              return input.startsWith('@');
            })
            .map((input: string): string => {
              return input.slice(1);
            });

          svgsToLoad.push({
            id,
            name,
            metadata: {
              tags,
              projects,
            },
          });
        }

        return svgsToLoad;
      },
    );

    await logger.asyncTask('load-images', async (logger: Logger): Promise<void[]> => {
      const images: FigmaImagesRecord = await logger.asyncTask(
        'fetch-api',
        async (): Promise<FigmaImagesRecord> => {
          return getFigmaImages({
            token: figmaAPIToken,
            file_key: figmaSourceFileKey,
            ids: svgsToLoad.map(({ id }: SVGToLoad): string => id),
          });
        },
      );

      return Promise.all(
        svgsToLoad.map(async ({ id, name, metadata }: SVGToLoad): Promise<void> => {
          await Promise.all([
            writeJsonFileSafe(join(outputDirectory, `${name}.metadata.json`), metadata),
            block(async (): Promise<void> => {
              logger.info(images[id]);
              await writeTextFileSafe(
                join(outputDirectory, `${name}.svg`),
                await (await fetch(images[id])).text(),
              );
            }),
          ]);
        }),
      );
    });
  });
}
