import type { FigmaNodeBase, GenericFigmaNodeBase } from '../../base/figma-node-base.ts';
import type { HavingFigmaFrameNodeProperties } from '../figma-frame-node.ts';

export interface FigmaComponentNode
  extends FigmaNodeBase<'COMPONENT'>, HavingFigmaFrameNodeProperties {
  readonly componentPropertyDefinitions: Readonly<Record<string, unknown>>;
}

export function isFigmaComponentNode(input: GenericFigmaNodeBase): input is FigmaComponentNode {
  return input.type === 'COMPONENT';
}
