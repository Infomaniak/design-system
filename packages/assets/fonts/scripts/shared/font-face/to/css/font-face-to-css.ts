import { dedent } from '../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import type { FontFaceDefinition } from '../../font-face.ts';
import { fontFaceFontWeightToCss } from '../../font-weight/to/css/font-face-font-weight-to-css.ts';

export function fontFaceToCss({
  fontDisplay,
  fontFamily,
  fontStyle,
  fontWeight,
  src,
}: FontFaceDefinition): string {
  const properties: (readonly [name: string, value: string])[] = [];

  if (fontDisplay !== undefined) {
    properties.push(['font-display', fontDisplay]);
  }

  if (fontFamily !== undefined) {
    properties.push(['font-family', fontFamily]);
  }

  if (fontStyle !== undefined) {
    properties.push(['font-style', fontStyle]);
  }

  if (fontWeight !== undefined) {
    properties.push(['font-weight', fontFaceFontWeightToCss(fontWeight)]);
  }

  if (src !== undefined) {
    properties.push(['src', src]);
  }

  return dedent`
    @font-face {
      ${properties.map(([name, value]) => `${name}: ${value};`).join('\n')}
    }
  `;
}
