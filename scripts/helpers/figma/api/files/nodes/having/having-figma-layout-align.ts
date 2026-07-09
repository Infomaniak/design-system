import type { FigmaLayoutAlign } from '../../types/figma-layout-align.ts';

export interface HavingFigmaLayoutAlign {
  readonly layoutAlign: FigmaLayoutAlign;
}

export type HavingOptionalFigmaLayoutAlign = Partial<HavingFigmaLayoutAlign>; // default: 'INHERIT'
