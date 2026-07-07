import { isFigmaBooleanOperationNode } from '../../../built-in/boolean-operation/figma-boolean-operation-node.ts';
import { figmaBooleanOperationNodeToSvgContent } from '../../../built-in/boolean-operation/to/svg/figma-boolean-operation-node-to-svg-content.ts';
import { isFigmaVectorNode } from '../../../built-in/vector/figma-vector-node.ts';
import { figmaVectorNodeToSvgContent } from '../../../built-in/vector/to/svg/figma-vector-node-to-svg-content.ts';
import type { GenericFigmaNodeBase } from '../../figma-node-base.ts';

export function genericFigmaNodeToSvgContent(node: GenericFigmaNodeBase): string {
  if (isFigmaVectorNode(node)) {
    return figmaVectorNodeToSvgContent(node);
  } else if (isFigmaBooleanOperationNode(node)) {
    return figmaBooleanOperationNodeToSvgContent(node);
  } else {
    throw new Error('Unsupported node');
  }
}
