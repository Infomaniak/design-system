import { dedent } from '../../../../../../../../misc/string/dedent/dedent.ts';
import { figmaColorToHex } from '../../../../../types/color/to/hex/figma-color-to-hex.ts';
import type { FigmaPaint } from '../../../../../types/paint/figma-paint.ts';
import { isFigmaSolidPaint } from '../../../../../types/paint/types/solid/figma-solid-paint.ts';
import type { FigmaPath } from '../../../../../types/path/figma-path.ts';
import { figmaPathToSvgPath } from '../../../../../types/path/to/svg/figma-path-to-svg-path.ts';
import { figmaStrokeCapToSvgStrokeLinecap } from '../../../../../types/stroke-cap/to/svg/figma-stroke-cap-to-svg-stroke-linecap.ts';
import { figmaStrokeJoinToSvgStrokeLinejoin } from '../../../../../types/stroke-join/to/svg/figma-stroke-join-to-svg-stroke-linejoin.ts';
import { figmaTransformToSvgTransform } from '../../../../../types/transform/to/svg/figma-transform-to-svg-transform.ts';
import type { FigmaNodeWithGeometry } from '../../figma-node-with-geometry.ts';

export function figmaNodeWithGeometryToSvgContent({
  fills,
  fillGeometry,
  strokes,
  strokeGeometry,
  strokeWeight,
  strokeCap,
  strokeJoin,
  strokeDashes,
  relativeTransform,
}: FigmaNodeWithGeometry): string {
  const transform: string = figmaTransformToSvgTransform(relativeTransform);

  const wrapWithTransform = (input: string): string => {
    return transform === 'none'
      ? input
      : dedent`
        <g transform="${transform}">
          ${input}
        </g>
      `;
  };
  if (fillGeometry.length > 0) {
    const fillColor: string | null = getFirstFigmaPaintColor(fills);

    const attributes: string[] = [`fill="${fillColor}"`];
    const extraAttributes: string = attributes.join(' ');

    return wrapWithTransform(
      fillGeometry
        .map((figmaPath: FigmaPath): string => {
          return figmaPathToSvgPath(figmaPath, extraAttributes);
        })
        .join('\n'),
    );
  }

  if (strokeGeometry.length > 0) {
    const strokeColor: string | null = getFirstFigmaPaintColor(strokes);

    const attributes: string[] = [
      `stroke="${strokeColor}"`,
      `stroke-width="${String(strokeWeight)}"`,
    ];

    if (strokeCap !== undefined) {
      attributes.push(`stroke-linecap="${figmaStrokeCapToSvgStrokeLinecap(strokeCap)}"`);
    }

    if (strokeJoin !== undefined) {
      attributes.push(`stroke-linejoin="${figmaStrokeJoinToSvgStrokeLinejoin(strokeJoin)}"`);
    }

    if (strokeDashes !== undefined && strokeDashes.length > 0) {
      attributes.push(`stroke-dasharray="${strokeDashes.join(',')}"`);
    }

    const extraAttributes: string = attributes.join(' ');

    return wrapWithTransform(
      strokeGeometry
        .map((figmaPath: FigmaPath): string => {
          return figmaPathToSvgPath(figmaPath, extraAttributes);
        })
        .join('\n'),
    );
  }

  throw new Error('Invalid geometry.');
}

/* INTERNAL */

function getFirstFigmaPaintColor(paints: readonly FigmaPaint[]): string | null {
  for (const paint of paints) {
    if (isFigmaSolidPaint(paint)) {
      return figmaColorToHex(paint.color);
    }
  }

  return null;
}
