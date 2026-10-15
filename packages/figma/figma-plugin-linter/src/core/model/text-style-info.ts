/**
 * Normalized style-relevant properties of a text style. The raw Figma values
 * are mixed-safe (`| symbol`); props that can't be read are omitted.
 */
export interface TextStyleInfo {
  readonly id: string;
  readonly name: string;
  /** False for styles local to the file, true for styles from a published library. */
  readonly remote: boolean;
  readonly fontSize?: number;
  /** The font style name (e.g. `Bold`, `Regular`) — the weight surface Figma exposes on `fontName`. */
  readonly fontWeight?: string;
  readonly textDecoration?: string;
  /** Normalized line height: `AUTO`, `<n>px` or `<n>%`. */
  readonly lineHeight?: string;
}

/** Structural raw style shape the sandbox hands over from the Figma API. */
export interface RawTextStyle {
  readonly id: string;
  readonly name: string;
  readonly remote?: boolean;
  readonly fontSize?: number | symbol;
  readonly fontName?: { readonly family: string; readonly style: string } | symbol;
  readonly textDecoration?: string | symbol;
  /** Mirrors the official `LineHeight` union: the `AUTO` variant carries no value. */
  readonly lineHeight?: { readonly unit: string; readonly value?: number } | symbol;
}

/**
 * Builds the normalized `TextStyleInfo` from the raw Figma style — the
 * record-building logic the loader and the `style-override` rule rely on.
 * Mixed (symbol) props are omitted, never guessed.
 */
export function buildTextStyleInfo(style: RawTextStyle): TextStyleInfo {
  return {
    id: style.id,
    name: style.name,
    remote: style.remote ?? false,
    ...(typeof style.fontSize === 'number' ? { fontSize: style.fontSize } : {}),
    ...(typeof style.fontName === 'object' ? { fontWeight: style.fontName.style } : {}),
    ...(typeof style.textDecoration === 'string' ? { textDecoration: style.textDecoration } : {}),
    ...(typeof style.lineHeight === 'object'
      ? { lineHeight: formatLineHeight(style.lineHeight) }
      : {}),
  };
}

/**
 * Normalizes a Figma line height into the comparable string form:
 * `AUTO`, `<n>px` or `<n>%`. Shared by the style builder and the node
 * extraction so both sides of the `style-override` comparison speak the same
 * language. A non-AUTO unit without a value (unreachable per the official
 * typings) degrades to `AUTO` instead of guessing.
 */
export function formatLineHeight(lineHeight: {
  readonly unit: string;
  readonly value?: number;
}): string {
  if (lineHeight.unit === 'AUTO' || lineHeight.value === undefined) {
    return 'AUTO';
  }

  return lineHeight.unit === 'PERCENT' ? `${lineHeight.value}%` : `${lineHeight.value}px`;
}
