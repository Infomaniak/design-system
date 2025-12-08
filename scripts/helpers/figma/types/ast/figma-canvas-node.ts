import { type FigmaColor } from '../figma-types.ts';
import { type FigmaNode } from './figma-node.ts';
import { type FigmaNodeWithChildren } from './types/figma-node-with-children.ts';

export interface FigmaCanvasNode extends FigmaNode<'CANVAS'>, FigmaNodeWithChildren {
  readonly backgroundColor: FigmaColor;
  readonly prototypeStartNodeID: string | null;
  readonly flowStartingPoints: readonly unknown[];
  readonly prototypeDevice: unknown;
  readonly documentationLinks: readonly unknown[];
  readonly exportSettings: readonly unknown[];
  readonly measurements: readonly unknown[];
}

export function isFigmaCanvasNode(input: FigmaNode): input is FigmaCanvasNode {
  return input.type === 'CANVAS';
}
