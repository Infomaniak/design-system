import { type FigmaNode } from './figma-node.ts';
import { type FigmaNodeWithChildren } from './types/figma-node-with-children.ts';

export interface FigmaSectionNode extends FigmaNode<'SECTION'>, FigmaNodeWithChildren {
  readonly sectionContentsHidden: boolean;
  readonly devStatus: unknown | null;
  readonly fills: readonly unknown[];
  readonly strokes: readonly unknown[];
  readonly strokeWeight: number;
  readonly strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  readonly absoluteBoundingBox: unknown;
  readonly absoluteRenderBounds: unknown | null;
}

export function isFigmaSectionNode(input: FigmaNode): input is FigmaSectionNode {
  return input.type === 'SECTION';
}
