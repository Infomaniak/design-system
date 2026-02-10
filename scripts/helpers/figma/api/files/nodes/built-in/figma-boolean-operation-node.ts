import type { FigmaNode } from '../figma-node.ts';
import type { HavingFigmaNodeChildren } from '../having-figma-node-children.ts';

export interface FigmaBooleanOperationNode
  extends FigmaNode<'BOOLEAN_OPERATION'>, HavingFigmaNodeChildren {
  readonly booleanOperation: string;
}

export function isFigmaBooleanOperationNode(input: FigmaNode): input is FigmaBooleanOperationNode {
  return input.type === 'BOOLEAN_OPERATION';
}
