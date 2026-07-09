export interface HavingFigmaLocked {
  readonly locked: boolean;
}

export type HavingOptionalFigmaLocked = Partial<HavingFigmaLocked>; // default: false
