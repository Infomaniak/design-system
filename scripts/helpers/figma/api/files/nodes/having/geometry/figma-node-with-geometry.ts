import type { HavingOptionalFigmaFillGeometry } from '../having-figma-fill-geometry.ts';
import type { HavingOptionalFigmaFills } from '../having-figma-fills.ts';
import type { HavingFigmaRelativeTransform } from '../having-figma-relative-transform.ts';
import type { HavingFigmaStrokeAlign } from '../having-figma-stroke-align.ts';
import type { HavingFigmaStrokeCap } from '../having-figma-stroke-cap.ts';
import type { HavingOptionalFigmaStrokeDashes } from '../having-figma-stroke-dashes.ts';
import type { HavingOptionalFigmaStrokeGeometry } from '../having-figma-stroke-geometry.ts';
import type { HavingFigmaStrokeJoin } from '../having-figma-stroke-join.ts';
import type { HavingFigmaStrokeWeight } from '../having-figma-stroke-weight.ts';
import type { HavingOptionalFigmaStrokes } from '../having-figma-strokes.ts';

export interface FigmaNodeWithGeometry
  extends
    HavingOptionalFigmaFills,
    HavingOptionalFigmaFillGeometry,
    HavingOptionalFigmaStrokes,
    HavingOptionalFigmaStrokeGeometry,
    HavingFigmaRelativeTransform,
    Partial<HavingFigmaStrokeCap>,
    Partial<HavingFigmaStrokeJoin>,
    HavingFigmaStrokeWeight,
    HavingFigmaStrokeAlign,
    HavingOptionalFigmaStrokeDashes {}
