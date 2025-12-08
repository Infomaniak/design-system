import { type FigmaNode } from './figma-node.ts';
import { type FigmaNodeWithChildren } from './types/figma-node-with-children.ts';

export interface FigmaBooleanOperationNode
  extends FigmaNode<'BOOLEAN_OPERATION'>,
    FigmaNodeWithChildren {
  readonly booleanOperation: string;
}

export function isFigmaBooleanOperationNode(input: FigmaNode): input is FigmaBooleanOperationNode {
  return input.type === 'BOOLEAN_OPERATION';
}
