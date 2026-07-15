import { isFigmaBooleanOperationNode } from '../../../built-in/boolean-operation/figma-boolean-operation-node.ts';
import { figmaBooleanOperationNodeToSvgContent } from '../../../built-in/boolean-operation/to/svg/figma-boolean-operation-node-to-svg-content.ts';
import { isFigmaVectorNode } from '../../../built-in/vector/figma-vector-node.ts';
import { figmaVectorNodeToSvgContent } from '../../../built-in/vector/to/svg/figma-vector-node-to-svg-content.ts';
import type { GenericFigmaNodeBase } from '../../figma-node-base.ts';

/**
 * Converts a generic Figma node into SVG content.
 *
 * @param {GenericFigmaNodeBase} node - The Figma node to be converted.
 * @return {string} The generated SVG content as a string.
 * @throws {Error} If the node type is unsupported.
 */
export function genericFigmaNodeToSvgContent(node: GenericFigmaNodeBase): string {
  if (isFigmaVectorNode(node)) {
    return figmaVectorNodeToSvgContent(node);
  } else if (isFigmaBooleanOperationNode(node)) {
    return figmaBooleanOperationNodeToSvgContent(node);
  } else {
    throw new Error('Unsupported node');
  }
}
