import { type FigmaNode, type GenericFigmaNode } from '../figma-node.ts';
import { type FigmaFrameNodeProperties } from './figma-frame-node.ts';

export interface FigmaGroupNode extends FigmaNode<'GROUP'>, FigmaFrameNodeProperties {}

export function isFigmaGroupNode(input: GenericFigmaNode): input is FigmaGroupNode {
  return input.type === 'GROUP';
}
