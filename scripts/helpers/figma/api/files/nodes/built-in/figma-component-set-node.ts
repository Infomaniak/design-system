import { type FigmaNode, type GenericFigmaNode } from '../figma-node.ts';
import { type FigmaFrameNodeProperties } from './figma-frame-node.ts';

export interface FigmaComponentSetNode
  extends FigmaNode<'COMPONENT_SET'>, FigmaFrameNodeProperties {
  readonly componentPropertyDefinitions: Readonly<Record<string, unknown>>;
}

export function isFigmaComponentSetNode(input: GenericFigmaNode): input is FigmaComponentSetNode {
  return input.type === 'COMPONENT_SET';
}
