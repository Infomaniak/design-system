import type { FigmaNodeWithGeometry } from './figma-node-with-geometry.ts';

export function isFigmaNodeWithGeometry(input: object): input is FigmaNodeWithGeometry {
  return (
    'fills' in input &&
    Array.isArray(input.fills) &&
    'strokes' in input &&
    Array.isArray(input.strokes) &&
    'fillGeometry' in input &&
    Array.isArray(input.fillGeometry) &&
    'strokeGeometry' in input &&
    Array.isArray(input.strokeGeometry) &&
    'relativeTransform' in input &&
    'strokeWeight' in input &&
    'strokeAlign' in input
  );
}
