import { type FigmaNode, type GenericFigmaNode } from '../figma-node.ts';
import { type HavingFigmaNodeChildren } from '../having-figma-node-children.ts';

export interface FigmaBooleanOperationNode
  extends FigmaNode<'BOOLEAN_OPERATION'>, HavingFigmaNodeChildren {
  readonly booleanOperation: string;
}

export function isFigmaBooleanOperationNode(
  input: GenericFigmaNode,
): input is FigmaBooleanOperationNode {
  return input.type === 'BOOLEAN_OPERATION';
}
