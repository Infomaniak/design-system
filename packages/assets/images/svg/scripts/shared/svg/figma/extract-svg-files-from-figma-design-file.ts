import { join } from 'node:path';
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
import { writeTextFileSafe } from '../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import type { TreeExplorerPickReturn } from '../../../../../../../../scripts/helpers/misc/tree-explorer/tree-explorer.ts';

import {
  extractSvgsFromFigma,
  extractIconName,
  type SVGToLoad,
} from './extract-svgs-from-figma.ts';

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
export async function extractSvgFilesFromFigmaDesignFile({
  outputDirectory,
  figmaAPIToken,
  figmaSourceFileKey,
  generateMasks,
  logger,
}: ExtractSvgFilesFromFigmaDesignFileOptions): Promise<void> {
  await extractSvgsFromFigma({
    outputDirectory,
    figmaAPIToken,
    figmaSourceFileKey,
    geometry: generateMasks ? 'paths' : undefined,
    resolveSvgsToLoad: (figmaFile: FigmaFile): readonly SVGToLoad[] =>
      resolveFlatComponents(figmaFile),
    onExtracted: generateMasks
      ? (figmaFile: FigmaFile, logger: Logger): Promise<void> =>
          generateMaskSvgs(figmaFile, outputDirectory, logger)
      : undefined,
    logger,
  });
}

function resolveFlatComponents(figmaFile: FigmaFile): readonly SVGToLoad[] {
  const svgsToLoad: SVGToLoad[] = [];

  for (const id in figmaFile.components) {
    const component: FigmaComponent = figmaFile.components[id];

    if (!isIconFigmaComponent(component.name)) {
      continue;
    }

    const parts: readonly string[] = component.description.split(/\s+/g);

    svgsToLoad.push({
      id,
      name: extractIconName(component.name),
      metadata: {
        tags: parts
          .filter((input: string): boolean => input.startsWith('#'))
          .map((input: string): string => input.slice(1)),
        categories: parts
          .filter((input: string): boolean => input.startsWith('@'))
          .map((input: string): string => input.slice(1)),
      },
    });
  }

  return svgsToLoad;
}

async function generateMaskSvgs(
  figmaFile: FigmaFile,
  outputDirectory: string,
  logger: Logger,
): Promise<void> {
  await logger.asyncTask('extract-filled-svgs', async (): Promise<void> => {
    await Promise.all(
      FigmaNodesExplorer.explore<FigmaComponentNode>(
        figmaFile.document,
        (node: GenericFigmaNodeBase): TreeExplorerPickReturn | void => {
          if (
            isFigmaComponentNode(node) &&
            isIconFigmaComponent(node.name) &&
            node.children.length === 1 &&
            isFigmaBooleanOperationNode(node.children[0]) &&
            node.children[0].booleanOperation === 'SUBTRACT'
          ) {
            return { pickSelf: true, pickChildren: false };
          }

          return { pickSelf: false, pickChildren: true };
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

function isIconFigmaComponent(name: string): boolean {
  return name.startsWith('esds/');
}
