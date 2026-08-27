import type { GenericFigmaNodeBase } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/base/figma-node-base.ts';
import {
  type FigmaComponentNode,
  isFigmaComponentNode,
} from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/component/figma-component-node.ts';
import { isFigmaComponentSetNode } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/figma-component-set-node.ts';
import { FigmaNodesExplorer } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/helpers/figma-nodes-explorer.ts';
import type { TreeExplorerPickReturn } from '../../../../../../../../scripts/helpers/misc/tree-explorer/tree-explorer.ts';
import type { FigmaFile } from '../../../../../../../../scripts/helpers/figma/api/files/types/figma-file.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';

import {
  extractSvgsFromFigma,
  extractIconName,
  type SVGToLoad,
} from './extract-svgs-from-figma.ts';

export interface ExtractOutlinedSvgFilesFromFigmaDesignFileOptions {
  readonly outputDirectory: string;
  readonly figmaAPIToken: string;
  readonly figmaSourceFileKey: string;
  readonly logger: Logger;
}

const VARIANT_NAME_REGEX = /^size=24,\s?filled=false$/;

/**
 * Extracts outlined SVG files from a Figma design file that uses component sets
 * with variant properties (e.g. "size=24, filled=false").
 *
 * Unlike `extractSvgFilesFromFigmaDesignFile` which expects flat components named
 * `esds/icon/<name>`, this function navigates component sets and selects the
 * `size=24, filled=false` variant of each icon.
 */
export function extractOutlinedSvgFilesFromFigmaDesignFile({
  outputDirectory,
  figmaAPIToken,
  figmaSourceFileKey,
  logger,
}: ExtractOutlinedSvgFilesFromFigmaDesignFileOptions): Promise<void> {
  return extractSvgsFromFigma({
    outputDirectory,
    figmaAPIToken,
    figmaSourceFileKey,
    resolveSvgsToLoad: (figmaFile: FigmaFile, logger: Logger): readonly SVGToLoad[] =>
      resolveOutlinedComponents(figmaFile, logger),
    logger,
  });
}

function resolveOutlinedComponents(
  figmaFile: FigmaFile,
  logger: Logger,
): readonly SVGToLoad[] {
  const iconSets = Object.entries(figmaFile.componentSets).filter(([, component]) =>
    /^esds\/icon\/[a-z0-9-]+\s*$/.test(component.name),
  );

  const result: SVGToLoad[] = [];

  for (const [setId, set] of iconSets) {
    const iconName: string = extractIconName(set.name);

    const variants = FigmaNodesExplorer.explore<FigmaComponentNode>(
      figmaFile.document,
      (node: GenericFigmaNodeBase): TreeExplorerPickReturn | void => {
        if (isFigmaComponentSetNode(node) && node.id === setId) {
          return { pickSelf: false, pickChildren: true };
        }

        if (isFigmaComponentSetNode(node)) {
          return { pickSelf: false, pickChildren: false };
        }

        if (isFigmaComponentNode(node)) {
          return { pickSelf: true, pickChildren: false };
        }

        return { pickSelf: false, pickChildren: true };
      },
    );

    const matchingVariant = variants.find((v) => VARIANT_NAME_REGEX.test(v.name));

    if (matchingVariant === undefined) {
      logger.warn(`No size=24, filled=false variant found for ${JSON.stringify(iconName)}`);
      continue;
    }

    result.push({
      id: matchingVariant.id,
      name: iconName,
      metadata: { tags: [], categories: [] },
    });
  }

  return result;
}
