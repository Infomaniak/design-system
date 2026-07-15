import type { FigmaNodeBase, GenericFigmaNodeBase } from '../base/figma-node-base.ts';
import type { HavingFigmaFrameNodeProperties } from './figma-frame-node.ts';

export interface FigmaComponentSetNode
  extends FigmaNodeBase<'COMPONENT_SET'>, HavingFigmaFrameNodeProperties {
  readonly componentPropertyDefinitions: Readonly<Record<string, unknown>>;
}

export function isFigmaComponentSetNode(
  input: GenericFigmaNodeBase,
): input is FigmaComponentSetNode {
  return input.type === 'COMPONENT_SET';
}
