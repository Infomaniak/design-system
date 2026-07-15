export interface HavingFigmaEffects {
  readonly effects: readonly unknown /* TODO */[];
}

export type HavingOptionalFigmaEffects = Partial<HavingFigmaEffects>; // default: []
