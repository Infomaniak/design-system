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
