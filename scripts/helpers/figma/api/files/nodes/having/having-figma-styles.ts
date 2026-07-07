export interface HavingFigmaStyles {
  readonly styles: Required<Record<string, string>>;
}

export interface HavingOptionalFigmaStyles {
  readonly styles?: Required<Record<string, string>>; // default: {}
}
