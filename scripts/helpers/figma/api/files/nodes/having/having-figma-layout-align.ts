import type { FigmaLayoutAlign } from '../../types/figma-layout-align.ts';

export interface HavingFigmaLayoutAlign {
  readonly layoutAlign: FigmaLayoutAlign;
}

export interface HavingOptionalFigmaLayoutAlign {
  readonly layoutAlign?: FigmaLayoutAlign; // default: 'INHERIT'
}
