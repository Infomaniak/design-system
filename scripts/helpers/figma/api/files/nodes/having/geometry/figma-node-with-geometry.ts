import type { HavingOptionalFigmaFillGeometry } from '../having-figma-fill-geometry.ts';
import type { HavingOptionalFigmaFills } from '../having-figma-fills.ts';
import type { HavingFigmaRelativeTransform } from '../having-figma-relative-transform.ts';
import type { HavingFigmaStrokeAlign } from '../having-figma-stroke-align.ts';
import type { HavingOptionalFigmaStrokeCap } from '../having-figma-stroke-cap.ts';
import type { HavingOptionalFigmaStrokeDashes } from '../having-figma-stroke-dashes.ts';
import type { HavingOptionalFigmaStrokeGeometry } from '../having-figma-stroke-geometry.ts';
import type { HavingOptionalFigmaStrokeJoin } from '../having-figma-stroke-join.ts';
import type { HavingFigmaStrokeWeight } from '../having-figma-stroke-weight.ts';
import type { HavingOptionalFigmaStrokes } from '../having-figma-strokes.ts';
import type { HavingOptionalFigmaVectorNetwork } from '../having-figma-vector-network.ts';

export interface FigmaNodeWithGeometry
  extends
    HavingOptionalFigmaVectorNetwork,
    HavingOptionalFigmaFills,
    HavingOptionalFigmaFillGeometry,
    HavingOptionalFigmaStrokes,
    HavingOptionalFigmaStrokeGeometry,
    HavingFigmaRelativeTransform,
    HavingOptionalFigmaStrokeCap,
    HavingOptionalFigmaStrokeJoin,
    HavingFigmaStrokeWeight,
    HavingFigmaStrokeAlign,
    HavingOptionalFigmaStrokeDashes {}
