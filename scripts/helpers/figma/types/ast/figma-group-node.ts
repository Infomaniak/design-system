import { type FigmaFrameNodeProperties } from './figma-frame-node.ts';
import { type FigmaNode } from './figma-node.ts';

export interface FigmaGroupNode extends FigmaNode<'GROUP'>, FigmaFrameNodeProperties {}

export function isFigmaGroupNode(input: FigmaNode): input is FigmaGroupNode {
  return input.type === 'GROUP';
}
