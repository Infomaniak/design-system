export interface HavingFigmaAnnotations {
  readonly annotations: readonly unknown /* TODO */[];
}

export type HavingOptionalFigmaAnnotations = Partial<HavingFigmaAnnotations>; // default: []
