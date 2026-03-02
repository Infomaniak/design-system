import { type FigmaNode, type GenericFigmaNode } from '../figma-node.ts';
import { type FigmaFrameNodeProperties } from './figma-frame-node.ts';

export interface FigmaComponentNode extends FigmaNode<'COMPONENT'>, FigmaFrameNodeProperties {
  readonly componentPropertyDefinitions: Readonly<Record<string, unknown>>;
}

export function isFigmaComponentNode(input: GenericFigmaNode): input is FigmaComponentNode {
  return input.type === 'COMPONENT';
}
