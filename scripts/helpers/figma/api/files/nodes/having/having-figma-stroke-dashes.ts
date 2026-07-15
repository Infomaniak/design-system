export interface HavingFigmaStrokeDashes {
  readonly strokeDashes: readonly number[];
}

export type HavingOptionalFigmaStrokeDashes = Partial<HavingFigmaStrokeDashes>; // default: []
