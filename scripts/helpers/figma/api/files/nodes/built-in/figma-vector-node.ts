import type { FigmaBlendMode } from '../../types/figma-blend-mode.ts';
import type { FigmaLayoutConstraint } from '../../types/figma-layout-constraint.ts';
import type { FigmaPaintOverride } from '../../types/figma-paint-override.ts';
import type { FigmaPaint } from '../../types/figma-paint.ts';
import type { FigmaPath } from '../../types/figma-path.ts';
import type { FigmaRectangle } from '../../types/figma-rectangle.ts';
import type { FigmaStrokeWeight } from '../../types/figma-stroke-weight.ts';
import type { FigmaTransform } from '../../types/figma-transform.ts';
import type { FigmaVariableWidthPoint } from '../../types/figma-variable-width-point.ts';
import type { FigmaVector } from '../../types/figma-vector.ts';
import type { FigmaComplexStrokeProperties } from '../../types/stroke-properties/figma-complex-stroke-properties.ts';
import type { FigmaNode, GenericFigmaNode } from '../figma-node.ts';
import type { HavingFigmaAbsoluteBoundingBox } from '../having/having-figma-absolute-bounding-box.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-node-types/#vector-props
 */
export interface HavingFigmaVectorNodeProperties extends HavingFigmaAbsoluteBoundingBox {
  readonly locked: boolean;
  // NOTE: similar to FigmaFrameNodeProperties
  readonly exportSettings: readonly unknown /* TODO */[];
  readonly blendMode: FigmaBlendMode;
  readonly preserveRatio: boolean;
  readonly layoutAlign: 'INHERIT' | 'STRETCH' | 'MIN' | 'CENTER' | 'MAX';
  readonly layoutGrow: number;
  readonly constraints: FigmaLayoutConstraint;
  readonly transitionNodeID: string | null;
  readonly transitionDuration: number;
  readonly transitionEasing: unknown /* TODO */;
  readonly opacity: number;
  // ...HavingFigmaAbsoluteBoundingBox,
  readonly absoluteRenderBounds: FigmaRectangle | null;
  readonly effects: readonly unknown /* TODO */[];
  readonly size: FigmaVector;
  readonly relativeTransform: FigmaTransform;
  readonly isMask: boolean;
  readonly fills: readonly FigmaPaint[];
  readonly fillGeometry: readonly FigmaPath[];
  readonly fillOverrideTable: Record<number, FigmaPaintOverride | null>;
  readonly strokes: readonly FigmaPaint[];
  readonly complexStrokeProperties: FigmaComplexStrokeProperties;
  readonly variableWidthPoints: readonly FigmaVariableWidthPoint[];
  readonly strokeWeight: number;
  readonly individualStrokeWeights: FigmaStrokeWeight;
  readonly strokeCap:
    | 'NONE'
    | 'ROUND'
    | 'SQUARE'
    | 'LINE_ARROW'
    | 'TRIANGLE_ARROW'
    | 'DIAMOND_FILLED'
    | 'CIRCLE_FILLED'
    | 'TRIANGLE_FILLED'
    | 'WASHI_TAPE_1'
    | 'WASHI_TAPE_2'
    | 'WASHI_TAPE_3'
    | 'WASHI_TAPE_4'
    | 'WASHI_TAPE_5'
    | 'WASHI_TAPE_6';
  readonly strokeJoin: 'MITER' | 'BEVEL' | 'ROUND';
  readonly strokeDashes: readonly number[];
  readonly strokeMiterAngle: number;
  readonly strokeGeometry: readonly FigmaPath[];
  readonly strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  readonly styles: Record<string, string>;
  readonly annotations: readonly unknown /* TODO */[];
}

export interface FigmaVectorNode extends FigmaNode<'VECTOR'>, HavingFigmaVectorNodeProperties {}

export function isFigmaVectorNode(input: GenericFigmaNode): input is FigmaVectorNode {
  return input.type === 'VECTOR';
}
