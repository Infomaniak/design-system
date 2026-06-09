import type { FigmaNode, GenericFigmaNode } from '../figma-node.ts';
import type { HavingFigmaAbsoluteBoundingBox } from '../having/having-figma-absolute-bounding-box.ts';
import type { HavingFigmaNodeChildren } from '../having/having-figma-node-children.ts';

export interface FigmaSectionNode
  extends FigmaNode<'SECTION'>, HavingFigmaNodeChildren, HavingFigmaAbsoluteBoundingBox {
  readonly sectionContentsHidden: boolean;
  readonly devStatus: unknown | null;
  readonly fills: readonly unknown[];
  readonly strokes: readonly unknown[];
  readonly strokeWeight: number;
  readonly strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  readonly absoluteRenderBounds: unknown | null;
}

export function isFigmaSectionNode(input: GenericFigmaNode): input is FigmaSectionNode {
  return input.type === 'SECTION';
}
