import { type FigmaNode, type GenericFigmaNode } from '../figma-node.ts';
import { type HavingFigmaNodeChildren } from '../having-figma-node-children.ts';

export interface FigmaTableNode extends FigmaNode<'TABLE'>, HavingFigmaNodeChildren {
  // TODO
}

export function isFigmaTableNode(input: GenericFigmaNode): input is FigmaTableNode {
  return input.type === 'TABLE';
}
