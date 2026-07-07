import type { FigmaNodeBase, GenericFigmaNodeBase } from '../base/figma-node-base.ts';
import type { HavingFigmaAbsoluteBoundingBox } from '../having/having-figma-absolute-bounding-box.ts';
import type { HavingFigmaAbsoluteRenderBounds } from '../having/having-figma-absolute-render-bounds.ts';
import type { HavingOptionalFigmaFills } from '../having/having-figma-fills.ts';
import type { HavingFigmaNodeChildren } from '../having/having-figma-node-children.ts';
import type { HavingFigmaStrokeAlign } from '../having/having-figma-stroke-align.ts';
import type { HavingFigmaStrokeWeight } from '../having/having-figma-stroke-weight.ts';
import type { HavingOptionalFigmaStrokes } from '../having/having-figma-strokes.ts';

export interface FigmaSectionNode
  extends
    FigmaNodeBase<'SECTION'>,
    HavingFigmaNodeChildren,
    HavingOptionalFigmaFills,
    HavingOptionalFigmaStrokes,
    HavingFigmaStrokeWeight,
    HavingFigmaStrokeAlign,
    HavingFigmaAbsoluteBoundingBox,
    HavingFigmaAbsoluteRenderBounds {
  // ...HavingFigmaNodeChildren,
  readonly sectionContentsHidden: boolean;
  readonly devStatus: unknown /* TODO */ | null;
  // ...HavingFigmaFills,
  // ...HavingFigmaStrokes,
  // ...HavingFigmaStrokeWeight,
  // ...HavingFigmaStrokeAlign,
  // ...HavingFigmaAbsoluteBoundingBox,
  // ...HavingFigmaAbsoluteRenderBounds,
}

export function isFigmaSectionNode(input: GenericFigmaNodeBase): input is FigmaSectionNode {
  return input.type === 'SECTION';
}
