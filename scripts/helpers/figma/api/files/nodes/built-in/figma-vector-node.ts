import type { FigmaBlendMode } from '../../types/figma-blend-mode.ts';
import type { FigmaLayoutConstraint } from '../../types/figma-layout-constraint.ts';
import type { FigmaPaintOverride } from '../../types/figma-paint-override.ts';
import type { FigmaRectangle } from '../../types/figma-rectangle.ts';
import type { FigmaStrokeWeight } from '../../types/figma-stroke-weight.ts';
import type { FigmaVariableWidthPoint } from '../../types/figma-variable-width-point.ts';
import type { FigmaVector } from '../../types/figma-vector.ts';
import type { FigmaComplexStrokeProperties } from '../../types/stroke-properties/figma-complex-stroke-properties.ts';
import type { FigmaTransform } from '../../types/transform/figma-transform.ts';
import type { FigmaNode, GenericFigmaNode } from '../figma-node.ts';
import type { HavingFigmaAbsoluteBoundingBox } from '../having/having-figma-absolute-bounding-box.ts';
import type { HavingFigmaFillGeometry } from '../having/having-figma-fill-geometry.ts';
import type { HavingFigmaFills } from '../having/having-figma-fills.ts';
import type { HavingFigmaRelativeTransform } from '../having/having-figma-relative-transform.ts';
import type { HavingFigmaStrokeAlign } from '../having/having-figma-stroke-align.ts';
import type { HavingFigmaStrokeCap } from '../having/having-figma-stroke-cap.ts';
import type { HavingFigmaStrokeDashes } from '../having/having-figma-stroke-dashes.ts';
import type { HavingFigmaStrokeGeometry } from '../having/having-figma-stroke-geometry.ts';
import type { HavingFigmaStrokeJoin } from '../having/having-figma-stroke-join.ts';
import type { HavingFigmaStrokeWeight } from '../having/having-figma-stroke-weight.ts';
import type { HavingFigmaStrokes } from '../having/having-figma-strokes.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-node-types/#vector-props
 */
export interface HavingFigmaVectorNodeProperties
  extends
    HavingFigmaAbsoluteBoundingBox,
    HavingFigmaRelativeTransform,
    HavingFigmaFills,
    HavingFigmaFillGeometry,
    HavingFigmaStrokes,
    HavingFigmaStrokeWeight,
    HavingFigmaStrokeCap,
    HavingFigmaStrokeJoin,
    HavingFigmaStrokeDashes,
    HavingFigmaStrokeGeometry,
    HavingFigmaStrokeAlign {
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
  // ...HavingFigmaRelativeTransform
  readonly relativeTransform: FigmaTransform;
  readonly isMask: boolean;
  // ...HavingFigmaFills,
  // ...HavingFigmaFillGeometry,
  readonly fillOverrideTable: Record<number, FigmaPaintOverride | null>;
  // ...HavingFigmaStrokes,
  readonly complexStrokeProperties: FigmaComplexStrokeProperties;
  readonly variableWidthPoints: readonly FigmaVariableWidthPoint[];
  // ...HavingFigmaStrokeWeight
  readonly individualStrokeWeights: FigmaStrokeWeight;
  // ...HavingFigmaStrokeCap,
  // ...HavingFigmaStrokeJoin,
  // ...HavingFigmaStrokeDashes,
  readonly strokeMiterAngle: number;
  // ...HavingFigmaStrokeGeometry
  // ...HavingFigmaStrokeAlign
  readonly styles: Record<string, string>;
  readonly annotations: readonly unknown /* TODO */[];
}

export interface FigmaVectorNode extends FigmaNode<'VECTOR'>, HavingFigmaVectorNodeProperties {}

export function isFigmaVectorNode(input: GenericFigmaNode): input is FigmaVectorNode {
  return input.type === 'VECTOR';
}
