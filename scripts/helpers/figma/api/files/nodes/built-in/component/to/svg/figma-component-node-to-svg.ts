import { dedent } from '../../../../../../../../misc/string/dedent/dedent.ts';

import { figmaTransformToSvgTransform } from '../../../../../types/transform/to/svg/figma-transform-to-svg-transform.ts';
import type { GenericFigmaNode } from '../../../../figma-node.ts';
import { isFigmaNodeWithGeometry } from '../../../../having/geometry/is-figma-node-with-geometry.ts';
import { isFigmaBooleanOperationNode } from '../../../figma-boolean-operation-node.ts';
import type { FigmaVectorNode } from '../../../figma-vector-node.ts';
import type { FigmaComponentNode } from '../../figma-component-node.ts';

/* INTERNAL */

/*----*/

function processNode(node: GenericFigmaNode, isRoot: boolean): readonly string[] {
  const parts: string[] = [];

  if (isFigmaNodeWithGeometry(node)) {
    const nodeParts = nodeToSvgParts(node);

    if (nodeParts.length > 0) {
      if (!isRoot) {
        const transform = figmaTransformToSvgTransform(node.relativeTransform);

        if (transform) {
          parts.push(`<g transform="${transform}">`);
          parts.push(...nodeParts);
          parts.push('</g>');
        } else {
          parts.push(...nodeParts);
        }
      } else {
        parts.push(...nodeParts);
      }
    }
  }

  // Boolean operations already embed computed geometry; do not descend into children
  if (isFigmaBooleanOperationNode(node)) {
    return parts;
  }

  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      parts.push(...processNode(child, false));
    }
  }

  return parts;
}

/* ---- Public API ---- */

export function figmaComponentNodeToSvg(node: FigmaComponentNode): string {
  const width = node.absoluteBoundingBox.width;
  const height = node.absoluteBoundingBox.height;
  const parts = processNode(node, true);

  return dedent`
    <svg width="${String(width)}" height="${String(height)}" viewBox="0 0 ${String(width)} ${String(height)}" xmlns="http://www.w3.org/2000/svg">
      ${parts.join('\n')}
    </svg>
  `;
}

export function figmaVectorNodeToSvg(node: FigmaVectorNode): string {
  // strokes
  // TODO continue here
}
