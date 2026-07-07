import type { FigmaColor } from '../../types/color/figma-color.ts';
import type { FigmaVector } from '../../types/figma-vector.ts';
import type { FigmaPaint } from '../../types/paint/figma-paint.ts';
import type { FigmaNodeBase, GenericFigmaNodeBase } from '../base/figma-node-base.ts';
import type { HavingFigmaAbsoluteBoundingBox } from '../having/having-figma-absolute-bounding-box.ts';
import type { HavingFigmaAbsoluteRenderBounds } from '../having/having-figma-absolute-render-bounds.ts';
import type { HavingOptionalFigmaAnnotations } from '../having/having-figma-annotations.ts';
import type { HavingFigmaBlendMode } from '../having/having-figma-blend-mode.ts';
import type { HavingOptionalFigmaComplexStrokeProperties } from '../having/having-figma-complex-stroke-properties.ts';

import type { HavingOptionalFigmaCornerRadius } from '../having/having-figma-corner-radius.ts';
import type { HavingOptionalFigmaCornerSmoothing } from '../having/having-figma-corner-smoothing.ts';
import type { HavingOptionalFigmaEffects } from '../having/having-figma-effects.ts';
import type { HavingOptionalFigmaFillGeometry } from '../having/having-figma-fill-geometry.ts';
import type { HavingOptionalFigmaFills } from '../having/having-figma-fills.ts';
import type { HavingFigmaLayoutAlign } from '../having/having-figma-layout-align.ts';
import type { HavingOptionalFigmaLayoutGrow } from '../having/having-figma-layout-grow.ts';
import type { HavingOptionalFigmaLocked } from '../having/having-figma-locked.ts';
import type { HavingFigmaNodeChildren } from '../having/having-figma-node-children.ts';
import type { HavingOptionalFigmaRectangleCornerRadii } from '../having/having-figma-rectangle-corner-radii.ts';
import type { HavingFigmaRelativeTransform } from '../having/having-figma-relative-transform.ts';
import type { HavingFigmaScrollBehavior } from '../having/having-figma-scroll-behavior.ts';
import type { HavingFigmaStrokeAlign } from '../having/having-figma-stroke-align.ts';
import type { HavingOptionalFigmaStrokeDashes } from '../having/having-figma-stroke-dashes.ts';
import type { HavingOptionalFigmaStrokeGeometry } from '../having/having-figma-stroke-geometry.ts';
import type { HavingFigmaStrokeWeight } from '../having/having-figma-stroke-weight.ts';
import type { HavingOptionalFigmaStrokes } from '../having/having-figma-strokes.ts';
import type { HavingOptionalFigmaStyles } from '../having/having-figma-styles.ts';
import type { HavingOptionalFigmaVariableWidthPoints } from '../having/having-figma-variable-width-points.ts';

/**
 * @inheritDoc https://developers.figma.com/docs/rest-api/file-node-types/#frame-props
 */
export interface HavingFigmaFrameNodeProperties
  extends
    HavingFigmaNodeChildren,
    HavingOptionalFigmaLocked,
    HavingOptionalFigmaFills,
    HavingOptionalFigmaStrokes,
    HavingOptionalFigmaComplexStrokeProperties,
    HavingOptionalFigmaVariableWidthPoints,
    HavingFigmaStrokeWeight,
    HavingFigmaStrokeAlign,
    HavingOptionalFigmaStrokeDashes,
    HavingOptionalFigmaCornerRadius,
    HavingOptionalFigmaRectangleCornerRadii,
    HavingOptionalFigmaCornerSmoothing,
    HavingFigmaBlendMode,
    HavingFigmaLayoutAlign,
    HavingFigmaAbsoluteBoundingBox,
    HavingFigmaAbsoluteRenderBounds,
    HavingFigmaRelativeTransform,
    HavingOptionalFigmaAnnotations,
    HavingOptionalFigmaEffects,
    HavingOptionalFigmaStyles,
    // NOTE: present in the JSON but not in the DOC
    HavingOptionalFigmaFillGeometry,
    HavingOptionalFigmaStrokeGeometry,
    HavingOptionalFigmaLayoutGrow,
    HavingFigmaScrollBehavior {
  // ...HavingFigmaNodeChildren
  // ...HavingOptionalFigmaLocked
  /**
   * @deprecated
   */
  readonly background: readonly FigmaPaint[];
  /**
   * @deprecated
   */
  readonly backgroundColor: FigmaColor;
  // ...HavingOptionalFigmaFills,
  // ...HavingOptionalFigmaStrokes,
  // ...HavingOptionalFigmaComplexStrokeProperties,
  // ...HavingOptionalFigmaVariableWidthPoints,
  // ...HavingFigmaStrokeWeight,
  // ...HavingFigmaStrokeAlign,
  // ...HavingOptionalFigmaStrokeDashes,
  // ...HavingOptionalFigmaCornerRadius,
  // ...HavingOptionalFigmaRectangleCornerRadii,
  // ...HavingOptionalFigmaCornerSmoothing,
  readonly exportSettings?: readonly unknown /* TODO */[];
  // ...HavingFigmaBlendMode,
  /**
   * @deprecated
   */
  readonly preserveRatio?: boolean;
  readonly targetAspectRatio?: number;
  readonly constraints: unknown /* TODO */;
  // ...HavingFigmaLayoutAlign,
  readonly interactions: readonly unknown /* TODO */[];
  readonly transitionNodeID?: string;
  readonly transitionDuration?: number;
  readonly transitionEasing?: unknown /* TODO */;
  readonly opacity?: number;
  // ...HavingFigmaAbsoluteBoundingBox,
  // ...HavingFigmaAbsoluteRenderBounds,
  readonly size: FigmaVector;
  readonly minWidth?: number | null;
  readonly maxWidth?: number | null;
  readonly minHeight?: number | null;
  readonly maxHeight?: number | null;
  // ...HavingFigmaRelativeTransform,
  readonly clipsContent: boolean;
  readonly layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID';
  readonly layoutSizingHorizontal: 'FIXED' | 'HUG' | 'FILL';
  readonly layoutSizingVertical: 'FIXED' | 'HUG' | 'FILL';
  readonly layoutWrap?: 'NO_WRAP' | 'WRAP';
  readonly primaryAxisSizingMode?: 'FIXED' | 'AUTO';
  readonly counterAxisSizingMode?: 'FIXED' | 'AUTO';
  readonly primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  readonly counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
  readonly gridRowCount?: number;
  readonly gridColumnCount?: number;
  readonly gridRowGap?: number;
  readonly gridColumnGap?: number;
  readonly gridColumnsSizing?: string;
  readonly gridRowsSizing?: string;
  readonly gridAutoTracks?: 'NONE' | 'ROWS';
  readonly gridItemsPositioning?: 'MANUAL' | 'ROW_AUTO_FLOW';
  readonly gridChildHorizontalAlign?: 'AUTO' | 'MIN' | 'CENTER' | 'MAX';
  readonly gridChildVerticalAlign?: 'AUTO' | 'MIN' | 'CENTER' | 'MAX';
  readonly gridRowSpan?: number;
  readonly gridColumnSpan?: number;
  readonly gridColumnAnchorIndex?: number;
  readonly gridRowAnchorIndex?: number;
  readonly paddingLeft?: number;
  readonly paddingRight?: number;
  readonly paddingTop?: number;
  readonly paddingBottom?: number;
  /**
   * @deprecated
   */
  readonly horizontalPadding?: number;
  /**
   * @deprecated
   */
  readonly verticalPadding?: number;
  readonly itemSpacing?: number;
  readonly counterAxisSpacing?: number;
  readonly layoutPositioning?: 'ABSOLUTE' | 'AUTO';
  readonly itemReverseZIndex?: boolean;
  readonly strokesIncludedInLayout?: boolean;
  readonly layoutGrids?: readonly unknown /* TODO */[];
  readonly overflowDirection?:
    'HORIZONTAL_SCROLLING' | 'VERTICAL_SCROLLING' | 'HORIZONTAL_AND_VERTICAL_SCROLLING' | 'NONE';
  // ...HavingOptionalFigmaEffects,
  readonly isMask?: boolean;
  /**
   * @deprecated
   */
  readonly isMaskOutline?: boolean;
  readonly maskType?: 'ALPHA' | 'VECTOR' | 'LUMINANCE';
  // ...HavingOptionalFigmaStyles,
  readonly devStatus?: null;
  // NOTE: present in the JSON but not in the DOC
  // ...HavingOptionalFigmaFillGeometry,
  // ...HavingOptionalFigmaStrokeGeometry,
  // ...HavingOptionalFigmaLayoutGrow,
  // ...HavingFigmaScrollBehavior,
}

export interface FigmaFrameNode extends FigmaNodeBase<'FRAME'>, HavingFigmaFrameNodeProperties {}

export function isFigmaFrameNode(input: GenericFigmaNodeBase): input is FigmaFrameNode {
  return input.type === 'FRAME';
}

/*---------*/
