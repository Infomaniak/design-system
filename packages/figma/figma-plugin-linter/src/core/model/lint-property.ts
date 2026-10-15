export type LintPropertyKind =
  | 'fill'
  | 'stroke'
  | 'padding'
  | 'gap'
  | 'cornerRadius'
  | 'strokeWeight'
  | 'effect'
  | 'opacity'
  | 'blendMode'
  | 'textStyle'
  | 'textContent'
  | 'component';

/** Every property kind the engine observes — the full `appliesTo` universe. */
export const ALL_PROPERTY_KINDS: readonly LintPropertyKind[] = [
  'fill',
  'stroke',
  'padding',
  'gap',
  'cornerRadius',
  'strokeWeight',
  'effect',
  'opacity',
  'blendMode',
  'textStyle',
  'textContent',
  'component',
];

export type LintValueKind = 'color' | 'number' | 'string' | 'effect';

export type LintPartValue =
  | { readonly kind: 'color'; readonly hex: string }
  | { readonly kind: 'number'; readonly value: number }
  | { readonly kind: 'string'; readonly value: string }
  | {
      readonly kind: 'effect';
      readonly effectType: string;
      readonly radius?: number;
      readonly offset?: { readonly x: number; readonly y: number };
      /** Present when the effect comes from an applied effect style, not raw values. */
      readonly styleId?: string;
    }
  | {
      readonly kind: 'textStyle';
      /** Present when a text style is applied; absent = styled by hand. */
      readonly styleId?: string;
      /** The node's current style-relevant props, for override comparison. */
      readonly fontSize?: number;
      readonly fontWeight?: string;
      readonly textDecoration?: string;
      /** Normalized line height: `AUTO`, `<n>px` or `<n>%`. */
      readonly lineHeight?: string;
    };

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
