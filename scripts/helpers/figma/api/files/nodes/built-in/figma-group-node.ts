import type { FigmaNodeBase, GenericFigmaNodeBase } from '../base/figma-node-base.ts';
import type { HavingFigmaFrameNodeProperties } from './figma-frame-node.ts';

export interface FigmaGroupNode extends FigmaNodeBase<'GROUP'>, HavingFigmaFrameNodeProperties {}

export function isFigmaGroupNode(input: GenericFigmaNodeBase): input is FigmaGroupNode {
  return input.type === 'GROUP';
}
