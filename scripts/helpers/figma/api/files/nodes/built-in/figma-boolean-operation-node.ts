import type { FigmaNode, GenericFigmaNode } from '../figma-node.ts';
import type { HavingFigmaAbsoluteBoundingBox } from '../having/having-figma-absolute-bounding-box.ts';
import type { HavingFigmaNodeChildren } from '../having/having-figma-node-children.ts';

export interface FigmaBooleanOperationNode
  extends FigmaNode<'BOOLEAN_OPERATION'>, HavingFigmaNodeChildren, HavingFigmaAbsoluteBoundingBox {
  readonly booleanOperation: 'SUBTRACT' | string;
}

export function isFigmaBooleanOperationNode(
  input: GenericFigmaNode,
): input is FigmaBooleanOperationNode {
  return input.type === 'BOOLEAN_OPERATION';
}
