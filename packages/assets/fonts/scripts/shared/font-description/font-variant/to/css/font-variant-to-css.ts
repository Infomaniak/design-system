import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { fontOpticalSizingToCss } from '../../font-optical-sizing/to/css/font-optical-sizing-to-css.ts';
import type { FontVariant } from '../../font-variant.ts';
import { fontWeightToCss } from '../../font-weight/to/css/font-weight-to-css.ts';

export interface FontVariantToCssOptions {
  readonly family: string;
  readonly src: string;
  readonly display?: string;
}

/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face
 */
export function fontVariantToCss(
  { style, weight, opticalSizing }: Omit<FontVariant, 'src'>,
  { family, display, src }: FontVariantToCssOptions,
): string {
  const properties: (readonly [name: string, value: string])[] = [];

  if (family !== undefined) {
    properties.push(['font-family', family]);
  }

  if (src !== undefined) {
    properties.push(['src', src]);
  }

  if (style !== undefined) {
    properties.push(['font-style', style]);
  }

  if (weight !== undefined) {
    properties.push(['font-weight', fontWeightToCss(weight)]);
  }

  if (opticalSizing !== undefined) {
    properties.push(['font-optical-sizing', fontOpticalSizingToCss(opticalSizing)]);
  }

  if (display !== undefined) {
    properties.push(['font-display', display]);
  }

  return dedent`
    @font-face {
      ${properties.map(([name, value]) => `${name}: ${value};`).join('\n')}
    }
  `;
}
