export interface HavingFigmaComponentPropertyDefinitions {
  readonly componentPropertyDefinitions: Readonly<Record<string, unknown>>;
}

export type HavingOptionalFigmaComponentPropertyDefinitions =
  Partial<HavingFigmaComponentPropertyDefinitions>; // default: {}
