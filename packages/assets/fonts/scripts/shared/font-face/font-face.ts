import type { FontFaceFontDisplay } from './font-display/font-face.font-display.ts';
import type { FontFaceFontStyle } from './font-style/font-face.font-style.ts';
import type { FontFaceFontWeight } from './font-weight/font-face.font-weight.ts';

export interface FontFaceDefinition {
  readonly fontDisplay?: FontFaceFontDisplay;
  readonly fontFamily: string;
  readonly fontStyle?: FontFaceFontStyle;
  readonly fontWeight?: FontFaceFontWeight;
  readonly src?: string;
}
