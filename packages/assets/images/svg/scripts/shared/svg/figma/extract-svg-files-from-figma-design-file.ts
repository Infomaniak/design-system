import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getFigmaFile } from '../../../../../../../../scripts/helpers/figma/api/files/get-figma-file.ts';
import { isFigmaFrameNode } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/figma-frame-node.ts';
import { FigmaNodesExplorer } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/helpers/figma-nodes-explorer.ts';
import type { FigmaComponent } from '../../../../../../../../scripts/helpers/figma/api/files/types/figma-component.ts';
import type { FigmaFile } from '../../../../../../../../scripts/helpers/figma/api/files/types/figma-file.ts';
import {
  type FigmaImagesRecord,
  getFigmaImages,
} from '../../../../../../../../scripts/helpers/figma/api/images/get-figma-images.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { block } from '../../../../../../../../scripts/helpers/misc/block.ts';
import { removeTrailingSlash } from '../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';

import { type FigmaSvgMetadata } from './figma-svg-metadata.ts';

export interface ExtractSvgFilesFromFigmaDesignFileOptions {
  readonly outputDirectory: string;
  readonly figmaAPIToken: string;
  readonly figmaSourceFileKey: string;
  readonly logger: Logger;
  readonly hasStockedVersion?: boolean;
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
  hasStockedVersion = false,
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
      async (logger: Logger): Promise<readonly SVGToLoad[]> => {
        const figmaFile: FigmaFile = await getFigmaFile({
          token: figmaAPIToken,
          fileKey: figmaSourceFileKey,
        });

        // await writeJsonFileSafe(join(outputDirectory, 'figma-file.json'), figmaFile);

        const svgsToLoad: SVGToLoad[] = [];

        // for each figma components
        for (const id in figmaFile.components) {
          const component: FigmaComponent = figmaFile.components[id];

          // skip `Type` component
          if (component.name.startsWith('Type=')) {
            continue;
          }

          let frameId: string | undefined;

          if (hasStockedVersion) {
            // explores the nodes to find the associated "stroked" version
            for (const node of FigmaNodesExplorer.explore(figmaFile.document)) {
              if (isFigmaFrameNode(node) && node.name === `stroke--${component.name}`) {
                frameId = node.id;
                break;
              }
            }

            if (frameId === undefined) {
              logger.error(`Unable to locate FRAME with name stroke--${component.name}`);
            }
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
            id: frameId === undefined ? id : frameId,
            name: component.name,
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
            fileKey: figmaSourceFileKey,
            ids: svgsToLoad.map(({ id }: SVGToLoad): string => id),
          });
        },
      );

      return Promise.all(
        svgsToLoad.map(async ({ id, name, metadata }: SVGToLoad): Promise<void> => {
          await Promise.all([
            writeFile(
              join(outputDirectory, `${name}.metadata.json`),
              JSON.stringify(metadata, null, 2),
            ),
            block(async (): Promise<void> => {
              logger.info(images[id]);
              await writeFile(
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
