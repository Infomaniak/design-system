import { dedent } from '../../../../../../../misc/string/dedent/dedent.ts';
import type { FigmaTransform } from '../../figma-transform.ts';
import { figmaTransformToSvgTransform } from './figma-transform-to-svg-transform.ts';

/**
 * Applies a Figma transform to the given SVG content by wrapping it in a `<g>` element
 * with the corresponding transformation attributes.
 *
 * @param {FigmaTransform} transform - The transformation matrix as provided by Figma.
 * @param {string} svgContent - The SVG content to which the transformation should be applied.
 * @return {string} The transformed SVG content, wrapped in a `<g>` element. If the transformation
 * is 'none', the original SVG content is returned unchanged.
 */
export function applyFigmaTransformToSvgContent(
  transform: FigmaTransform,
  svgContent: string,
): string {
  const svgTransform: string = figmaTransformToSvgTransform(transform);
  return svgTransform === 'none'
    ? svgContent
    : dedent`
        <g transform="${svgTransform}">
          ${svgContent}
        </g>
      `;
}
