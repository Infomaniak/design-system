import type { FigmaLayoutConstraint } from '../../../types/figma-layout-constraint.ts';
import type { FigmaPaintOverride } from '../../../types/figma-paint-override.ts';
import type { FigmaVector } from '../../../types/figma-vector.ts';
import type { FigmaNodeBase, GenericFigmaNodeBase } from '../../base/figma-node-base.ts';
import type { HavingOptionalComplexStrokeProperties } from '../../having/having-complex-stroke-properties.ts';
import type { HavingFigmaAbsoluteBoundingBox } from '../../having/having-figma-absolute-bounding-box.ts';
import type { HavingFigmaAbsoluteRenderBounds } from '../../having/having-figma-absolute-render-bounds.ts';
import type { HavingOptionalFigmaAnnotations } from '../../having/having-figma-annotations.ts';
import type { HavingFigmaBlendMode } from '../../having/having-figma-blend-mode.ts';
import type { HavingOptionalFigmaEffects } from '../../having/having-figma-effects.ts';
import type { HavingOptionalFigmaFillGeometry } from '../../having/having-figma-fill-geometry.ts';
import type { HavingOptionalFigmaFills } from '../../having/having-figma-fills.ts';
import type { HavingOptionalFigmaIndividualStrokeWeights } from '../../having/having-figma-individual-stroke-weights.ts';
import type { HavingOptionalFigmaLayoutAlign } from '../../having/having-figma-layout-align.ts';
import type { HavingOptionalFigmaLayoutGrow } from '../../having/having-figma-layout-grow.ts';
import type { HavingFigmaRelativeTransform } from '../../having/having-figma-relative-transform.ts';
import type { HavingFigmaScrollBehavior } from '../../having/having-figma-scroll-behavior.ts';
import type { HavingFigmaStrokeAlign } from '../../having/having-figma-stroke-align.ts';
import type { HavingFigmaStrokeCap } from '../../having/having-figma-stroke-cap.ts';
import type { HavingOptionalFigmaStrokeDashes } from '../../having/having-figma-stroke-dashes.ts';
import type { HavingOptionalFigmaStrokeGeometry } from '../../having/having-figma-stroke-geometry.ts';
import type { HavingFigmaStrokeJoin } from '../../having/having-figma-stroke-join.ts';
import type { HavingOptionalFigmaStrokeMiterAngle } from '../../having/having-figma-stroke-miter-angle.ts';
import type { HavingFigmaStrokeWeight } from '../../having/having-figma-stroke-weight.ts';
import type { HavingOptionalFigmaStrokes } from '../../having/having-figma-strokes.ts';
import type { HavingOptionalFigmaStyles } from '../../having/having-figma-styles.ts';
import type { HavingOptionalFigmaVariableWidthPoints } from '../../having/having-figma-variable-width-points.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-node-types/#vector-props
 */
export interface HavingFigmaVectorNodeProperties
  extends
    HavingFigmaBlendMode,
    HavingOptionalFigmaLayoutAlign,
    HavingOptionalFigmaLayoutGrow,
    HavingFigmaAbsoluteBoundingBox,
    HavingFigmaAbsoluteRenderBounds,
    HavingOptionalFigmaEffects,
    HavingFigmaRelativeTransform,
    HavingOptionalFigmaFills,
    HavingOptionalFigmaFillGeometry,
    HavingOptionalFigmaStrokes,
    HavingOptionalComplexStrokeProperties,
    HavingOptionalFigmaVariableWidthPoints,
    HavingFigmaStrokeWeight,
    HavingOptionalFigmaIndividualStrokeWeights,
    HavingFigmaStrokeCap,
    HavingFigmaStrokeJoin,
    HavingOptionalFigmaStrokeDashes,
    HavingOptionalFigmaStrokeMiterAngle,
    HavingOptionalFigmaStrokeGeometry,
    HavingFigmaStrokeAlign,
    HavingOptionalFigmaStyles,
    HavingOptionalFigmaAnnotations,
    // NOTE: present in the JSON but not in the DOC
    HavingFigmaScrollBehavior {
  readonly locked?: boolean; // default: false
  // NOTE: similar to FigmaFrameNodeProperties
  readonly exportSettings?: readonly unknown /* TODO */[]; // default: []
  // ...HavingFigmaBlendMode,
  readonly preserveRatio?: boolean; // default: false
  // ...HavingOptionalFigmaLayoutAlign,
  // ...HavingOptionalFigmaLayoutGrow,
  readonly constraints: FigmaLayoutConstraint;
  readonly transitionNodeID?: string | null; // default: null
  readonly transitionDuration?: number | null; // default: null
  readonly transitionEasing?: unknown /* TODO */ | null; // default: null
  readonly opacity?: number; // default: 1
  // ...HavingFigmaAbsoluteBoundingBox,
  // ...HavingFigmaAbsoluteRenderBounds
  // ...HavingOptionalFigmaEffects
  readonly size: FigmaVector;
  // ...HavingFigmaRelativeTransform
  readonly isMask?: boolean; // default: false
  // ...HavingOptionalFigmaFills,
  // ...HavingOptionalFigmaFillGeometry,
  readonly fillOverrideTable: Record<number, FigmaPaintOverride | null>;
  // ...HavingOptionalFigmaStrokes,
  // ...HavingOptionalComplexStrokeProperties,
  // ...HavingOptionalVariableWidthPoints,
  // ...HavingFigmaStrokeWeight
  // ...HavingOptionalFigmaIndividualStrokeWeights
  // ...HavingFigmaStrokeCap,
  // ...HavingFigmaStrokeJoin,
  // ...HavingOptionalFigmaStrokeDashes,
  // ...HavingOptionalStrokeMiterAngle,
  // ...HavingOptionalFigmaStrokeGeometry
  // ...HavingFigmaStrokeAlign
  // ...HavingOptionalFigmaStyles
  // ...HavingOptionalFigmaAnnotations,
  // ...HavingFigmaScrollBehavior,
  // NOTE: present in the JSON but not in the DOC
  readonly interactions: readonly unknown /* TODO */[];
}

export interface FigmaVectorNode extends FigmaNodeBase<'VECTOR'>, HavingFigmaVectorNodeProperties {}

export function isFigmaVectorNode(input: GenericFigmaNodeBase): input is FigmaVectorNode {
  return input.type === 'VECTOR';
}
