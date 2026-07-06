import type { FigmaNode, GenericFigmaNode } from '../figma-node.ts';
import type { HavingFigmaFrameNodeProperties } from './figma-frame-node.ts';

export interface FigmaGroupNode extends FigmaNode<'GROUP'>, HavingFigmaFrameNodeProperties {}

export function isFigmaGroupNode(input: GenericFigmaNode): input is FigmaGroupNode {
  return input.type === 'GROUP';
}
