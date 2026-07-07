import { dedent } from '../../../../../../../misc/string/dedent/dedent.ts';
import type { FigmaTransform } from '../../figma-transform.ts';
import { figmaTransformToSvgTransform } from './figma-transform-to-svg-transform.ts';

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
