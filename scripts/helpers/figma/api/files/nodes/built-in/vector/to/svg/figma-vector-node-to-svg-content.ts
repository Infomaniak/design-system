import { figmaNodeWithGeometryToSvgContent } from '../../../../having/geometry/to/svg/figma-node-with-geometry-to-svg-content.ts';
import type { FigmaVectorNode } from '../../figma-vector-node.ts';

export function figmaVectorNodeToSvgContent(node: FigmaVectorNode): string {
  return figmaNodeWithGeometryToSvgContent(node);
}
