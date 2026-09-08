export type LintPropertyKind = 'fill' | 'stroke' | 'padding' | 'gap' | 'cornerRadius';

/** Every property kind the engine observes — the full `appliesTo` universe. */
export const ALL_PROPERTY_KINDS: readonly LintPropertyKind[] = [
  'fill',
  'stroke',
  'padding',
  'gap',
  'cornerRadius',
];

export type LintValueKind = 'color' | 'number';

export type LintPartValue =
  | { readonly kind: 'color'; readonly hex: string }
  | { readonly kind: 'number'; readonly value: number };

export interface LintPropertyPart {
  readonly id: string;
  readonly label?: string;
  readonly boundVariableId?: string;
  readonly value: LintPartValue;
}

export interface LintProperty {
  readonly kind: LintPropertyKind;
  readonly valueKind: LintValueKind;
  readonly parts: readonly LintPropertyPart[];
}
