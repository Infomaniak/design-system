import type { HavingFigmaFillGeometry } from '../having-figma-fill-geometry.ts';
import type { HavingFigmaFills } from '../having-figma-fills.ts';
import type { HavingFigmaRelativeTransform } from '../having-figma-relative-transform.ts';
import type { HavingFigmaStrokeAlign } from '../having-figma-stroke-align.ts';
import type { HavingFigmaStrokeCap } from '../having-figma-stroke-cap.ts';
import type { HavingFigmaStrokeDashes } from '../having-figma-stroke-dashes.ts';
import type { HavingFigmaStrokeGeometry } from '../having-figma-stroke-geometry.ts';
import type { HavingFigmaStrokeJoin } from '../having-figma-stroke-join.ts';
import type { HavingFigmaStrokeWeight } from '../having-figma-stroke-weight.ts';
import type { HavingFigmaStrokes } from '../having-figma-strokes.ts';

export interface FigmaNodeWithGeometry
  extends
    HavingFigmaFills,
    HavingFigmaFillGeometry,
    HavingFigmaStrokes,
    HavingFigmaStrokeGeometry,
    HavingFigmaRelativeTransform,
    Partial<HavingFigmaStrokeCap>,
    Partial<HavingFigmaStrokeJoin>,
    HavingFigmaStrokeWeight,
    HavingFigmaStrokeAlign,
    Partial<HavingFigmaStrokeDashes> {}
