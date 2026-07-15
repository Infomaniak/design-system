export interface HavingFigmaStyles {
  readonly styles: Required<Record<string, string>>;
}

export type HavingOptionalFigmaStyles = Partial<HavingFigmaStyles>; // default: {}
