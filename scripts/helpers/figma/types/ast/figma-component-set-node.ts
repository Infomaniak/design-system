import { type FigmaFrameNodeProperties } from './figma-frame-node.ts';
import { type FigmaNode } from './figma-node.ts';

export interface FigmaComponentSetNode
  extends FigmaNode<'COMPONENT_SET'>,
    FigmaFrameNodeProperties {
  readonly componentPropertyDefinitions: Readonly<Record<string, unknown>>;
}

export function isFigmaComponentSetNode(input: FigmaNode): input is FigmaComponentSetNode {
  return input.type === 'COMPONENT_SET';
}
