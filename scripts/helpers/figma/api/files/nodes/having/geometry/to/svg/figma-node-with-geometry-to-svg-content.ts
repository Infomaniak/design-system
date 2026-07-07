import { figmaColorToHex } from '../../../../../types/color/to/hex/figma-color-to-hex.ts';
import type { FigmaPaint } from '../../../../../types/paint/figma-paint.ts';
import { isFigmaSolidPaint } from '../../../../../types/paint/types/solid/figma-solid-paint.ts';
import type { FigmaPath } from '../../../../../types/path/figma-path.ts';
import { figmaPathToSvgPath } from '../../../../../types/path/to/svg/figma-path-to-svg-path.ts';
import { figmaStrokeCapToSvgStrokeLinecap } from '../../../../../types/stroke-cap/to/svg/figma-stroke-cap-to-svg-stroke-linecap.ts';
import { figmaStrokeJoinToSvgStrokeLinejoin } from '../../../../../types/stroke-join/to/svg/figma-stroke-join-to-svg-stroke-linejoin.ts';
import { applyFigmaTransformToSvgContent } from '../../../../../types/transform/to/svg/apply-figma-transform-to-svg-content.ts';
import { figmaVectorNetworkToFigmaPath } from '../../../../../types/vector-network/to/figma-path/figma-vector-network-to-figma-path.ts';
import type { FigmaNodeWithGeometry } from '../../figma-node-with-geometry.ts';

export function figmaNodeWithGeometryToSvgContent({
  vectorNetwork,
  fills = [],
  fillGeometry = [],
  strokes = [],
  strokeGeometry = [],
  strokeWeight,
  strokeCap,
  strokeJoin,
  strokeDashes,
  relativeTransform,
}: FigmaNodeWithGeometry): string {
  const generatePaths = (paths: readonly FigmaPath[], attributes: readonly string[]): string => {
    const extraAttributes: string = attributes.join(' ');

    return applyFigmaTransformToSvgContent(
      relativeTransform,
      paths
        .map((figmaPath: FigmaPath): string => {
          return figmaPathToSvgPath(figmaPath, extraAttributes);
        })
        .join('\n'),
    );
  };

  if (fillGeometry.length > 0) {
    const fillColor: string | null = getFirstFigmaPaintColor(fills);

    return generatePaths(fillGeometry, [`fill="${fillColor}"`]);
  }

  if (strokeGeometry.length > 0) {
    const strokeColor: string | null = getFirstFigmaPaintColor(strokes);

    if (vectorNetwork === undefined) {
      // NOTE: figma outputs the `strokeGeometry` as outlined, thus, we have to use `fill` instead of `stroke`

      return generatePaths(strokeGeometry, [`fill="${strokeColor}"`]);
    } else {
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

      attributes.push(`fill="none"`);

      return generatePaths([figmaVectorNetworkToFigmaPath(vectorNetwork)], attributes);
    }
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
