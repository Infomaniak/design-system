import type { FigmaColor } from '../../types/color/figma-color.ts';
import type { FigmaRectangle } from '../../types/figma-rectangle.ts';
import type { FigmaVector } from '../../types/figma-vector.ts';
import type { FigmaPaint } from '../../types/paint/figma-paint.ts';
import type { FigmaTransform } from '../../types/transform/figma-transform.ts';
import type { FigmaNode, GenericFigmaNode } from '../figma-node.ts';
import type { HavingFigmaAbsoluteBoundingBox } from '../having/having-figma-absolute-bounding-box.ts';
import type { HavingFigmaNodeChildren } from '../having/having-figma-node-children.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-node-types/#frame-props
 */
export interface HavingFigmaFrameNodeProperties
  extends HavingFigmaNodeChildren, HavingFigmaAbsoluteBoundingBox {
  // ...HavingFigmaNodeChildren
  readonly locked: boolean;
  readonly background: readonly FigmaPaint[];
  readonly backgroundColor: FigmaColor;
  readonly fills: readonly FigmaPaint[];
  readonly strokes: readonly FigmaPaint[];
  readonly complexStrokeProperties: unknown /* TODO */;
  readonly variableWidthPoints: unknown[] /* TODO */;
  readonly strokeWeight: number;
  readonly strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  readonly strokeDashes: readonly number[];
  readonly cornerRadius: number;
  readonly rectangleCornerRadii: readonly number[];
  readonly cornerSmoothing: number;
  readonly exportSettings: readonly unknown /* TODO */[];
  readonly blendMode: unknown /* TODO */;
  /**
   * @deprecated
   */
  readonly preserveRatio: boolean;
  readonly targetAspectRatio: number;
  readonly constraints: unknown /* TODO */;
  readonly layoutAlign: 'INHERIT' | 'STRETCH' | 'MIN' | 'CENTER' | 'MAX';
  readonly interactions: readonly unknown /* TODO */[];
  readonly transitionNodeID: string;
  readonly transitionDuration: number;
  readonly transitionEasing: unknown /* TODO */;
  readonly opacity: number;
  // ...HavingFigmaAbsoluteBoundingBox,
  readonly absoluteRenderBounds: FigmaRectangle | null;
  readonly size: FigmaVector;
  readonly minWidth: number | null;
  readonly maxWidth: number | null;
  readonly minHeight: number | null;
  readonly maxHeight: number | null;
  readonly relativeTransform: FigmaTransform;
  // ... TODO
}

export interface FigmaFrameNode extends FigmaNode<'FRAME'>, HavingFigmaFrameNodeProperties {}

export function isFigmaFrameNode(input: GenericFigmaNode): input is FigmaFrameNode {
  return input.type === 'FRAME';
}
