import { dedent } from '../../../../../../../../misc/string/dedent/dedent.ts';

import type { GenericFigmaNodeBase } from '../../../../base/figma-node-base.ts';
import { figmaNodeWithGeometryToSvgContent } from '../../../../having/geometry/to/svg/figma-node-with-geometry-to-svg-content.ts';
import { type FigmaVectorNode, isFigmaVectorNode } from '../../../vector/figma-vector-node.ts';
import type { FigmaComponentNode } from '../../figma-component-node.ts';

export function figmaComponentNodeToSvg({
  absoluteBoundingBox: { width, height },
  children,
}: FigmaComponentNode): string {
  return dedent`
    <svg width="${String(width)}" height="${String(height)}" viewBox="0 0 ${String(width)} ${String(height)}" xmlns="http://www.w3.org/2000/svg">
      ${children.map(genericFigmaNodeToSvgContent).join('\n')}
    </svg>
  `;
}

export function genericFigmaNodeToSvgContent(node: GenericFigmaNodeBase): string {
  if (isFigmaVectorNode(node)) {
    return figmaVectorNodeToSvgContent(node);
  } else {
    throw new Error('Unsupported node');
  }
}

export function figmaVectorNodeToSvgContent(node: FigmaVectorNode): string {
  return figmaNodeWithGeometryToSvgContent(node);
}
