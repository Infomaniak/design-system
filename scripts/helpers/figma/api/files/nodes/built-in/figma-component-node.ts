import type { FigmaNode, GenericFigmaNode } from '../figma-node.ts';
import type { HavingFigmaFrameNodeProperties } from './figma-frame-node.ts';

export interface FigmaComponentNode extends FigmaNode<'COMPONENT'>, HavingFigmaFrameNodeProperties {
  readonly componentPropertyDefinitions: Readonly<Record<string, unknown>>;
}

export function isFigmaComponentNode(input: GenericFigmaNode): input is FigmaComponentNode {
  return input.type === 'COMPONENT';
}
