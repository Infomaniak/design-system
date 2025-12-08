import { type FigmaNode } from './figma-node.ts';
import { type FigmaNodeWithChildren } from './types/figma-node-with-children.ts';

export interface FigmaTableNode extends FigmaNode<'TABLE'>, FigmaNodeWithChildren {
  // TODO
}

export function isFigmaTableNode(input: FigmaNode): input is FigmaTableNode {
  return input.type === 'TABLE';
}
