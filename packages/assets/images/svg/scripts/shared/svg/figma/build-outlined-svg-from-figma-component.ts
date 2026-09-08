import type { GenericFigmaNodeBase } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/base/figma-node-base.ts';
import { isFigmaBooleanOperationNode } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/boolean-operation/figma-boolean-operation-node.ts';
import {
  type FigmaComponentNode,
  isFigmaComponentNode,
} from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/component/figma-component-node.ts';
import { isFigmaFrameNode } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/figma-frame-node.ts';
import { isFigmaGroupNode } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/figma-group-node.ts';
import { isFigmaVectorNode } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/built-in/vector/figma-vector-node.ts';
import { isFigmaNodeWithGeometry } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/having/geometry/is-figma-node-with-geometry.ts';
import { isFigmaNodeVisible } from '../../../../../../../../scripts/helpers/figma/api/files/nodes/helpers/is-figma-node-visible.ts';
import type { FigmaPath } from '../../../../../../../../scripts/helpers/figma/api/files/types/path/figma-path.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import {
  applyPathTransformToPathData,
  composePathTransforms,
  identityPathTransform,
  type PathTransform,
} from '../../icons/bake-transform-into-path.ts';
import { parseWindingRule, type SvgOutlinePath } from '../../icons/outline-path.ts';

export interface ExtractSymbolOutlinePathsFromFigmaComponentOptions {
  readonly node: FigmaComponentNode;
  readonly logger: Logger;
}

export interface OutlinedSvgBuildFailure {
  readonly name: string;
  readonly reason: string;
}

export interface OutlinedSvgWrite {
  readonly name: string;
  readonly svg: string;
}

export interface BuildOutlinedSvgsFromFigmaComponentsOptions {
  readonly components: readonly (readonly [name: string, node: FigmaComponentNode])[];
  readonly writeSvg: (options: OutlinedSvgWrite) => Promise<void>;
  readonly logger: Logger;
}

/**
 * Builds and writes an outlined SVG per Figma component, isolating build failures: a failing
 * component does not prevent the other components from being built and written. Once every
 * component has been processed, all failures are aggregated into a single error.
 */
export async function buildOutlinedSvgsFromFigmaComponents({
  components,
  writeSvg,
  logger,
}: BuildOutlinedSvgsFromFigmaComponentsOptions): Promise<void> {
  const failures: OutlinedSvgBuildFailure[] = [];

  await Promise.all(
    components.map(async ([name, node]): Promise<void> => {
      let svg: string;
      try {
        svg = buildOutlinedSvgFromFigmaComponent({ node, logger });
      } catch (error: unknown) {
        failures.push({
          name,
          reason: error instanceof Error ? error.message : String(error),
        });
        return;
      }

      await writeSvg({ name, svg });
    }),
  );

  if (failures.length > 0) {
    throw new Error(
      `Failed to generate ${String(failures.length)} of ${String(components.length)} outlined SVG(s):\n${failures
        .toSorted(
          (failure: OutlinedSvgBuildFailure, otherFailure: OutlinedSvgBuildFailure): number =>
            failure.name.localeCompare(otherFailure.name),
        )
        .map(({ name, reason }: OutlinedSvgBuildFailure): string => {
          return `- ${JSON.stringify(name)}: ${reason}`;
        })
        .join('\n')}`,
    );
  }
}

export function extractSymbolOutlinePathsFromFigmaComponent({
  node,
  logger,
}: ExtractSymbolOutlinePathsFromFigmaComponentOptions): readonly SvgOutlinePath[] {
  const outlinedPaths: SvgOutlinePath[] = [];
  walkNodeChildren(node, identityPathTransform(), logger, outlinedPaths);
  return outlinedPaths;
}

export interface BuildOutlinedSvgFromFigmaComponentOptions {
  readonly node: FigmaComponentNode;
  readonly logger: Logger;
}

export function buildOutlinedSvgFromFigmaComponent({
  node,
  logger,
}: BuildOutlinedSvgFromFigmaComponentOptions): string {
  const outlinedPaths: readonly SvgOutlinePath[] = extractSymbolOutlinePathsFromFigmaComponent({
    node,
    logger,
  });

  if (outlinedPaths.length === 0) {
    throw new Error(`No outline geometry extracted for component ${JSON.stringify(node.name)}.`);
  }

  const { width, height } = node.absoluteBoundingBox;

  return `<svg width="${String(width)}" height="${String(height)}" viewBox="0 0 ${String(width)} ${String(height)}" xmlns="http://www.w3.org/2000/svg">
  ${outlinedPaths.map(figmaPathToSvg).join('\n  ')}
</svg>
`;
}

const OUTLINED_SVG_FILL_COLOR = 'black';
const EVENODD_WINDING_RULE = 'EVENODD';

function figmaPathToSvg({ d, windingRule }: SvgOutlinePath): string {
  const fillRule: string = windingRule === 'EVENODD' ? ' fill-rule="evenodd"' : '';
  return `<path d="${d}" fill="${OUTLINED_SVG_FILL_COLOR}"${fillRule}/>`;
}

function walkNodeChildren(
  node: GenericFigmaNodeBase,
  nodeToComponent: PathTransform,
  logger: Logger,
  outlinedPaths: SvgOutlinePath[],
): void {
  for (const child of getNodeChildren(node)) {
    if (!isFigmaNodeVisible(child)) {
      continue;
    }

    const childTransform: PathTransform =
      'relativeTransform' in child && Array.isArray(child.relativeTransform)
        ? composePathTransforms(
            nodeToComponent,
            child.relativeTransform as unknown as PathTransform,
          )
        : nodeToComponent;

    if (isFigmaVectorNode(child) || isFigmaBooleanOperationNode(child)) {
      extractNodeGeometry(child, childTransform, logger, outlinedPaths);
      continue;
    }

    if (isFigmaGroupNode(child) || isFigmaFrameNode(child) || isFigmaComponentNode(child)) {
      walkNodeChildren(child, childTransform, logger, outlinedPaths);
      continue;
    }

    if (isFigmaNodeWithGeometry(child)) {
      extractNodeGeometry(child, childTransform, logger, outlinedPaths);
      continue;
    }

    throw new Error(
      `Unsupported node type ${JSON.stringify(child.type)} in component ${JSON.stringify(node.name)}.`,
    );
  }
}

function extractNodeGeometry(
  node: GenericFigmaNodeBase,
  transform: PathTransform,
  logger: Logger,
  outlinedPaths: SvgOutlinePath[],
): void {
  const fillGeometry: readonly FigmaPath[] = isFigmaNodeWithGeometry(node)
    ? (node.fillGeometry as readonly FigmaPath[])
    : [];
  const strokeGeometry: readonly FigmaPath[] = isFigmaNodeWithGeometry(node)
    ? (node.strokeGeometry as readonly FigmaPath[])
    : [];

  if (fillGeometry.length === 0 && strokeGeometry.length === 0) {
    if (isFigmaBooleanOperationNode(node) && node.booleanOperation === 'SUBTRACT') {
      logger.warn(
        `SUBTRACT node ${JSON.stringify(node.name)} without own geometry: children emitted as EVENODD compound (approximation).`,
      );
      const childrenPaths: SvgOutlinePath[] = [];
      walkNodeChildren(node, transform, logger, childrenPaths);
      for (const path of childrenPaths) {
        outlinedPaths.push({ ...path, windingRule: EVENODD_WINDING_RULE });
      }
      return;
    }
    logger.warn(`Node ${JSON.stringify(node.name)} (${node.type}) has no geometry, skipped.`);
    return;
  }

  if (fillGeometry.length > 0 && strokeGeometry.length > 0) {
    logger.warn(
      `Node ${JSON.stringify(node.name)} (${node.type}) has both fill and stroke geometry, both emitted.`,
    );
  }

  for (const figmaPath of [...fillGeometry, ...strokeGeometry]) {
    outlinedPaths.push({
      d: applyPathTransformToPathData(figmaPath.path, transform),
      windingRule: parseWindingRule(figmaPath.windingRule),
    });
  }
}

function getNodeChildren(node: GenericFigmaNodeBase): readonly GenericFigmaNodeBase[] {
  return 'children' in node && Array.isArray(node.children)
    ? (node.children as readonly GenericFigmaNodeBase[])
    : [];
}
