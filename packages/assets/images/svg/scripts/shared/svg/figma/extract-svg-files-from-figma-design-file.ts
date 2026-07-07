import { join } from 'node:path';
import { getFigmaFile } from '../../../../../../../../scripts/helpers/figma/api/files/get-figma-file.ts';
import type { GenericFigmaNodeBase } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/base/figma-node-base.ts';
import {
  type FigmaComponentNode,
  isFigmaComponentNode,
} from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/component/figma-component-node.ts';
import {
  type FigmaBooleanOperationNode,
  isFigmaBooleanOperationNode,
} from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/figma-boolean-operation-node.ts';
import type { HavingFigmaAbsoluteBoundingBox } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/having/having-figma-absolute-bounding-box.ts';
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
import { dedent } from '../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import type { TreeExplorerPickReturn } from '../../../../../../../../scripts/helpers/misc/tree-explorer/tree-explorer.ts';
import { removeTrailingSlash } from '../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';

import { type FigmaSvgMetadata } from './figma-svg-metadata.ts';

export interface ExtractSvgFilesFromFigmaDesignFileOptions {
  readonly outputDirectory: string;
  readonly figmaAPIToken: string;
  readonly figmaSourceFileKey: string;
  readonly generateMasks: boolean;
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
          geometry: 'paths',
        });
      },
    );

    // TODO: DEBUG
    await writeJsonFileSafe(join(outputDirectory, 'figma-file.json'), figmaFile);

    for (const node of FigmaNodesExplorer.explore<FigmaComponentNode>(
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
    )) {
      console.log(JSON.stringify(node, null, 2));
      return;
    }

    return;

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
          if (!isIconFigmaComponent(component.name) || !component.name.endsWith('filled')) {
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

    if (generateMasks) {
      /*
      NOTE:
        filled component are extracted as "outlined" svgs from the previous operation.
        We'll generate true "mask" svgs from theses "filled" svgs.
     */
      await logger.asyncTask('extract-filled-svgs', async (logger: Logger): Promise<void> => {
        interface SVGToLoad extends SVGInnerShape {
          readonly name: string;
          readonly base: SVGInnerShape;
          readonly cutouts: readonly SVGInnerShape[];
        }

        // extract the "filled" svgs from the list of component nodes present in the figma file
        const svgsToLoad: readonly SVGToLoad[] = Array.from(
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
          ),
        ).map((node: FigmaComponentNode): SVGToLoad => {
          const name: string = extractIconName(node.name);

          if (!name.endsWith('-filled')) {
            throw new Error(
              `Found an icon ${JSON.stringify(name)} with SUBTRACT operation not ending with "-filled".`,
            );
          }

          const booleanOperation: FigmaBooleanOperationNode = node
            .children[0] as FigmaBooleanOperationNode;

          // a "SUBTRACT" operation contains a "base" and many "cutouts" (what is subtracted)
          const [base, ...cutouts] = booleanOperation.children as readonly (GenericFigmaNodeBase &
            HavingFigmaAbsoluteBoundingBox)[];

          return {
            ...figmaNodeToSVGInnerShape(node),
            name,
            base: figmaNodeToSVGInnerShape(base),
            cutouts: cutouts.map(figmaNodeToSVGInnerShape),
          };
        });

        if (svgsToLoad.length === 0) {
          logger.info('No "filled" svg to extract.');
          return;
        }

        // get all the svgs's urls in one fetch using the figma api -> for the base and the cutouts
        const images: FigmaImagesRecord = await logger.asyncTask(
          'get-urls',
          async (): Promise<FigmaImagesRecord> => {
            return getFigmaImages({
              token: figmaAPIToken,
              file_key: figmaSourceFileKey,
              ids: svgsToLoad.flatMap(({ base, cutouts }: SVGToLoad): readonly string[] => {
                return [base.id, ...cutouts.map((cutout: SVGInnerShape): string => cutout.id)];
              }),
            });
          },
        );

        await logger.asyncTask('store-svgs', async (logger: Logger): Promise<void> => {
          await Promise.all(
            svgsToLoad.map(
              async ({ name, x, y, width, height, base, cutouts }: SVGToLoad): Promise<void> => {
                logger.info(name);

                // get the svg content for the base and cutouts
                const [baseSvg, ...cutoutSvgs] = await Promise.all([
                  fetchFigmaSvgAsset(images[base.id]),
                  ...cutouts.map((cutout: SVGInnerShape): Promise<string> => {
                    return fetchFigmaSvgAsset(images[cutout.id]);
                  }),
                ]);

                // create a unique mask id
                const maskId: string = `mask_${name.replace(/\W/g, '_')}`;

                // create the "base" svg content
                const positionedBaseSvgContent: string = wrapWithSvgTranslation(
                  extractSvgContent(baseSvg),
                  base.x - x,
                  base.y - y,
                );

                // create the "base" svg content for the mask => it's the same as the "base" one, but with stroke and fill beeing white.
                const positionedBaseSvgContentForMask: string = replaceSvgFillAndStroke(
                  positionedBaseSvgContent,
                  'white',
                );

                // create the "cutouts" svg content for the mask => the "black" parts that are subtracted in the mask
                const positionedCutoutSvgContentsForMask: string = cutouts
                  .map((cutout: SVGInnerShape, index: number) => {
                    return wrapWithSvgTranslation(
                      replaceSvgFillAndStroke(extractSvgContent(cutoutSvgs[index]), 'black'),
                      cutout.x - x,
                      cutout.y - y,
                    );
                  })
                  .join('\n');

                // assemble the final svg
                const svg: string = dedent`
                  <svg width="${String(width)}" height="${String(height)}" viewBox="0 0 ${String(width)} ${String(height)}" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <mask id="${maskId}" fill="transparent">
                        ${positionedBaseSvgContentForMask}
                        ${positionedCutoutSvgContentsForMask}
                      </mask>
                    </defs>
                    <g mask="url(#${maskId})">
                      ${positionedBaseSvgContent}
                    </g>
                  </svg>
                `;

                await writeTextFileSafe(join(outputDirectory, `${name}.mask.svg`), svg);
              },
            ),
          );
        });
      });
    }
  });
}

/* INTERNAL */

function isIconFigmaComponent(name: string): boolean {
  return name.startsWith('esds/');
}

function extractIconName(name: string): string {
  const match: RegExpMatchArray | null = /^esds\/icon\/([a-z0-9-]+)$/g.exec(name);

  if (match === null) {
    throw new Error(`Invalid name: ${JSON.stringify(name)}`);
  }

  return match[1];
}

async function fetchFigmaSvgAsset(url: string): Promise<string> {
  return (await fetch(url)).text();
}

/*------------*/

/*------------*/

// FILLED SVGS

interface SVGInnerShape {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

function figmaNodeToSVGInnerShape(
  node: GenericFigmaNodeBase & HavingFigmaAbsoluteBoundingBox,
): SVGInnerShape {
  return {
    id: node.id,
    x: node.absoluteBoundingBox.x,
    y: node.absoluteBoundingBox.y,
    width: node.absoluteBoundingBox.width,
    height: node.absoluteBoundingBox.height,
  };
}

/**
 * Translates a svg content, wrapping it in a "translate" group.
 */
function wrapWithSvgTranslation(content: string, x: number, y: number): string {
  return dedent`
    <g transform="translate(${String(x)} ${String(y)})">
      ${content}
    </g>
  `;
}

/**
 * Replaces the stroke and fill attributes with another value.
 */
function replaceSvgFillAndStroke(content: string, value: string): string {
  return content
    .replace(/stroke="[^"]*"/g, `stroke="${value}"`)
    .replace(/fill="[^"]*"/g, `fill="${value}"`);
}

/**
 * Extracts the content of an svg (removes the `<svg>` tags)
 */
function extractSvgContent(svg: string): string {
  svg = svg.trim();

  if (!svg.endsWith('</svg>')) {
    throw new Error('Invalid svg.');
  }

  const match: RegExpMatchArray | null = /^<svg[^>]*>/g.exec(svg);

  if (match === null) {
    throw new Error('Invalid svg.');
  }

  return svg.slice(match[0].length, -6 /* '</svg>'.length */).trim();
}
