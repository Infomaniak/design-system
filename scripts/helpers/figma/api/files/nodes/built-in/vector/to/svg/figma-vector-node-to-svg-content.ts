import { figmaNodeWithGeometryToSvgContent } from '../../../../having/geometry/to/svg/figma-node-with-geometry-to-svg-content.ts';
import type { FigmaVectorNode } from '../../figma-vector-node.ts';

/**
 * Converts a Figma vector node to its corresponding SVG content as a string.
 *
 * @param {FigmaVectorNode} node - The Figma vector node to be converted. It is expected to have geometry data that can be rendered as SVG.
 * @return The SVG content string that represents the visual output of the Figma vector node.
 */
export function figmaVectorNodeToSvgContent(node: FigmaVectorNode): string {
  return figmaNodeWithGeometryToSvgContent(node);
}
