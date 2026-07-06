import type { FigmaVector } from '../../../figma-vector.ts';
import type { FigmaPaintBase, GenericFigmaPaintBase } from '../../base/figma-paint-base.ts';

export interface FigmaPatternPaint extends FigmaPaintBase<'PATTERN'> {
  readonly sourceNodeId: string;
  readonly tileType: 'RECTANGULAR' | 'HORIZONTAL_HEXAGONAL' | 'VERTICAL_HEXAGONAL';
  readonly scalingFactor: number;
  readonly spacing: FigmaVector;
  readonly horizontalAlignment: 'START' | 'CENTER' | 'END';
  readonly verticalAlignment: 'START' | 'CENTER' | 'END';
}

export function isFigmaPatternPaint(input: GenericFigmaPaintBase): input is FigmaPatternPaint {
  return input.type === 'PATTERN';
}
