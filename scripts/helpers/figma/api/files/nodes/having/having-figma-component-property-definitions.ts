export interface HavingFigmaComponentPropertyDefinitions {
  readonly componentPropertyDefinitions: Readonly<Record<string, unknown>>;
}

export interface HavingOptionalFigmaComponentPropertyDefinitions {
  readonly componentPropertyDefinitions?: Readonly<Record<string, unknown>>; // default: {}
}
