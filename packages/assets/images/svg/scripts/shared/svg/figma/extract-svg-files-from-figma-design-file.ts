import { join } from 'node:path';
import { getFigmaFile } from '../../../../../../../../scripts/helpers/figma/api/files/get-figma-file.ts';
import type { GenericFigmaNodeBase } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/base/figma-node-base.ts';
import { isFigmaBooleanOperationNode } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/boolean-operation/figma-boolean-operation-node.ts';
import {
  type FigmaComponentNode,
  isFigmaComponentNode,
} from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/component/figma-component-node.ts';
import { figmaComponentNodeToSvg } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/component/to/svg/figma-component-node-to-svg.ts';
import { FigmaNodesExplorer } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/helpers/figma-nodes-explorer.ts';
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
import type { TreeExplorerPickReturn } from '../../../../../../../../scripts/helpers/misc/tree-explorer/tree-explorer.ts';
import { removeTrailingSlash } from '../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';

import { ICON_NAME_PATTERN_SOURCE } from '../../icons/icon-name.ts';
import { buildOutlinedSvgsFromFigmaComponents } from './build-outlined-svg-from-figma-component.ts';
import { type FigmaSvgMetadata } from './figma-svg-metadata.ts';

export const FIGMA_SVG_OUTLINES_SUB_DIRECTORY_NAME = 'outlines';

export interface ExtractSvgFilesFromFigmaDesignFileOptions {
  readonly outputDirectory: string;
  readonly figmaAPIToken: string;
  readonly figmaSourceFileKey: string;
  readonly generateMasks: boolean;
  /**
   * Generates a `<name>.outline.svg` file per icon component (stroke → outline geometry) in the
   * "outlines" sub-directory of the output directory.
   */
  readonly generateOutlinedSvgs: boolean;
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
  generateMasks,
  generateOutlinedSvgs,
  logger,
}: ExtractSvgFilesFromFigmaDesignFileOptions): Promise<void> {
  return logger.asyncTask('extract-figma-svgs', async (logger: Logger): Promise<void> => {
    outputDirectory = removeTrailingSlash(outputDirectory);

    const figmaFile: FigmaFile = await logger.asyncTask(
      'get-figma-file',
      (): Promise<FigmaFile> => {
        return getFigmaFile({
          token: figmaAPIToken,
          file_key: figmaSourceFileKey,
          /*
        NOTE:
          "fillGeometry" and "strokeGeometry" (required for outline generation) are only present
          in the Figma API response when the file is fetched with "geometry=paths".
       */
          geometry: generateMasks || generateOutlinedSvgs ? 'paths' : undefined,
        });
      },
    );

    // NOTE: DEBUG
    // await writeJsonFileSafe(join(outputDirectory, 'figma-file.json'), figmaFile);

    await logger.asyncTask('extract-component-svgs', async (logger: Logger): Promise<void> => {
      interface SVGToLoad {
        readonly id: string;
        readonly name: string;
        readonly metadata: FigmaSvgMetadata;
      }

      // extract the svgs ids/names/metadata from the list of components present in the figma file
      const svgsToLoad: readonly SVGToLoad[] = block((): readonly SVGToLoad[] => {
        const svgsToLoad: SVGToLoad[] = [];

        // for each figma components
        for (const id in figmaFile.components) {
          const component: FigmaComponent = figmaFile.components[id];

          // skip non svg components
          if (!isIconFigmaComponent(component.name)) {
            continue;
          }

          const parts: readonly string[] = component.description.split(/\s+/g);

          svgsToLoad.push({
            id,
            name: extractIconName(component.name),
            metadata: {
              tags: parts
                .filter((input: string): boolean => {
                  return input.startsWith('#');
                })
                .map((input: string): string => {
                  return input.slice(1);
                }),
              categories: parts
                .filter((input: string): boolean => {
                  return input.startsWith('@');
                })
                .map((input: string): string => {
                  return input.slice(1);
                }),
            },
          });
        }

        return svgsToLoad;
      });

      if (svgsToLoad.length === 0) {
        throw new Error('No svg to extract.');
      }

      // load all the svgs' urls in one fetch using the figma api
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

      // store the svgs with their metadata in the local filesystem
      await logger.asyncTask('store-svgs', async (): Promise<void> => {
        await Promise.all(
          svgsToLoad.map(async ({ id, name, metadata }: SVGToLoad): Promise<void> => {
            await Promise.all([
              writeJsonFileSafe(join(outputDirectory, `${name}.metadata.json`), metadata),
              block(async (): Promise<void> => {
                logger.info(name, images[id]);
                await writeTextFileSafe(
                  join(outputDirectory, `${name}.svg`),
                  await fetchFigmaSvgAsset(images[id]),
                );
              }),
            ]);
          }),
        );
      });
    });

    if (generateOutlinedSvgs) {
      await logger.asyncTask('extract-outlined-svgs', async (): Promise<void> => {
        const componentNodesByName: Map<string, FigmaComponentNode> = new Map(
          FigmaNodesExplorer.explore<FigmaComponentNode>(
            figmaFile.document,
            (node: GenericFigmaNodeBase): TreeExplorerPickReturn | void => {
              if (isFigmaComponentNode(node) && isIconFigmaComponent(node.name)) {
                return {
                  pickSelf: true,
                  pickChildren: false,
                };
              } else {
                return {
                  pickSelf: false,
                  pickChildren: true,
                };
              }
            },
          ).map((node: FigmaComponentNode): [string, FigmaComponentNode] => {
            return [extractIconName(node.name), node];
          }),
        );

        await buildOutlinedSvgsFromFigmaComponents({
          components: [...componentNodesByName.entries()],
          writeSvg: async ({ name, svg }): Promise<void> => {
            await writeTextFileSafe(
              join(outputDirectory, FIGMA_SVG_OUTLINES_SUB_DIRECTORY_NAME, `${name}.outline.svg`),
              svg,
            );
          },
          logger,
        });
      });
    }

    if (generateMasks) {
      /*
      NOTE:
        filled component are extracted as "outlined" svgs from the previous operation.
        We'll generate true "mask" svgs from theses "filled" svgs.
     */
      await logger.asyncTask('extract-filled-svgs', async (): Promise<void> => {
        // extract the "filled" svgs from the list of component nodes present in the figma file
        await Promise.all(
          FigmaNodesExplorer.explore<FigmaComponentNode>(
            figmaFile.document,
            (node: GenericFigmaNodeBase): TreeExplorerPickReturn | void => {
              if (
                // "filled" svgs are figma components with a "SUBTRACT" boolean operation
                isFigmaComponentNode(node) &&
                isIconFigmaComponent(node.name) &&
                node.children.length === 1 &&
                isFigmaBooleanOperationNode(node.children[0]) &&
                node.children[0].booleanOperation === 'SUBTRACT'
              ) {
                return {
                  pickSelf: true,
                  pickChildren: false,
                };
              } else {
                return {
                  pickSelf: false,
                  pickChildren: true,
                };
              }
            },
          ).map(async (node: FigmaComponentNode): Promise<void> => {
            const name: string = extractIconName(node.name);

            if (!name.endsWith('-filled')) {
              throw new Error(
                `Found an icon ${JSON.stringify(name)} with SUBTRACT operation not ending with "-filled".`,
              );
            }

            await writeTextFileSafe(
              join(outputDirectory, `${name}.mask.svg`),
              figmaComponentNodeToSvg(node),
            );
          }),
        );
      });
    }
  });
}

/* INTERNAL */

function isIconFigmaComponent(name: string): boolean {
  return name.startsWith('esds/');
}

function extractIconName(name: string): string {
  const match: RegExpMatchArray | null = new RegExp(
    `^esds/icon/(${ICON_NAME_PATTERN_SOURCE})$`,
    'g',
  ).exec(name);

  if (match === null) {
    throw new Error(`Invalid name: ${JSON.stringify(name)}`);
  }

  return match[1];
}

async function fetchFigmaSvgAsset(url: string): Promise<string> {
  return (await fetch(url)).text();
}
