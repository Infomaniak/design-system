import { describe, expect, test } from 'vitest';
import {
  applyPathTransformToPathData,
  composePathTransforms,
  computePathDataBoundingBox,
  computePathsBoundingBox,
  identityPathTransform,
} from './bake-transform-into-path.ts';

describe('bake-transform-into-path', () => {
  describe('applyPathTransformToPathData', () => {
    test('round-trips with the identity transform', () => {
      expect(applyPathTransformToPathData('M 1.5 2.5 L 3 4 Z', identityPathTransform())).toBe(
        'M 1.5 2.5 L 3 4 Z',
      );
    });

    test('applies a translation', () => {
      expect(
        applyPathTransformToPathData('M 1 2 L 3 4', [
          [1, 0, 10],
          [0, 1, 20],
        ]),
      ).toBe('M 11 22 L 13 24');
    });

    test('applies a scale and translation', () => {
      expect(
        applyPathTransformToPathData('M 4 4 L 20 20', [
          [2, 0, 1],
          [0, 3, 2],
        ]),
      ).toBe('M 9 14 L 41 62');
    });

    test('normalizes implicit line commands after a move', () => {
      expect(applyPathTransformToPathData('M 1 2 3 4', identityPathTransform())).toBe(
        'M 1 2 L 3 4',
      );
    });

    test('resolves relative commands against the current point', () => {
      expect(applyPathTransformToPathData('M 1 2 l 3 4 L 1 0', identityPathTransform())).toBe(
        'M 1 2 L 4 6 L 1 0',
      );
    });

    test('resolves a relative move and its implicit lines', () => {
      expect(applyPathTransformToPathData('m 1 2 3 4', identityPathTransform())).toBe(
        'M 1 2 L 4 6',
      );
    });

    test('expands horizontal and vertical commands to lines', () => {
      expect(applyPathTransformToPathData('M 1 2 h 3 v 4 H 0 V 1', identityPathTransform())).toBe(
        'M 1 2 L 4 2 L 4 6 L 0 6 L 0 1',
      );
    });

    test('expands relative cubic commands', () => {
      expect(applyPathTransformToPathData('M 1 1 c 1 1 2 2 3 3', identityPathTransform())).toBe(
        'M 1 1 C 2 2 3 3 4 4',
      );
    });

    test('expands smooth cubic commands by reflecting the previous control point', () => {
      expect(
        applyPathTransformToPathData('M 1 1 C 2 2 3 4 4 5 S 6 6 7 8', identityPathTransform()),
      ).toBe('M 1 1 C 2 2 3 4 4 5 C 5 6 6 6 7 8');
    });

    test('uses the current point as first control of a leading smooth command', () => {
      expect(applyPathTransformToPathData('M 1 1 S 2 2 3 3', identityPathTransform())).toBe(
        'M 1 1 C 1 1 2 2 3 3',
      );
    });

    test('expands relative smooth commands', () => {
      expect(applyPathTransformToPathData('M 1 1 s 1 1 2 2', identityPathTransform())).toBe(
        'M 1 1 C 1 1 2 2 3 3',
      );
    });

    test('expands smooth quadratic commands by reflecting the previous control point', () => {
      expect(applyPathTransformToPathData('M 1 1 Q 2 2 3 3 T 5 5', identityPathTransform())).toBe(
        'M 1 1 Q 2 2 3 3 Q 4 4 5 5',
      );
    });

    test('uses the current point as control of a leading smooth quadratic command', () => {
      expect(applyPathTransformToPathData('M 1 1 T 3 3', identityPathTransform())).toBe(
        'M 1 1 Q 1 1 3 3',
      );
    });

    test('expands relative smooth quadratic commands', () => {
      expect(applyPathTransformToPathData('M 1 1 q 1 1 2 2 t 2 2', identityPathTransform())).toBe(
        'M 1 1 Q 2 2 3 3 Q 4 4 5 5',
      );
    });

    test('restores the subpath start after a close command', () => {
      expect(applyPathTransformToPathData('M 1 1 L 2 2 Z l 1 1', identityPathTransform())).toBe(
        'M 1 1 L 2 2 Z L 2 2',
      );
    });

    test('restores the subpath start of a relative move with implicit lines', () => {
      expect(
        applyPathTransformToPathData('M 1 1 Z m 3 0 1 0 Z l 1 0', identityPathTransform()),
      ).toBe('M 1 1 Z M 4 1 L 5 1 Z L 5 1');
    });

    test('converts a small arc to a single cubic bézier', () => {
      const transformed: string = applyPathTransformToPathData(
        'M 0 0 A 2 2 0 0 1 2 0',
        identityPathTransform(),
      );
      expect(transformed).toMatch(/^M 0 0 C [\d.-]+ [\d.-]+ [\d.-]+ [\d.-]+ 2 0$/);
      expect(computePathDataBoundingBox(transformed)).toEqual({
        minX: 0,
        minY: expect.closeTo(-0.3573, 3),
        maxX: 2,
        maxY: 0,
      });
    });

    test('converts an arc in the other sweep direction', () => {
      const transformed: string = applyPathTransformToPathData(
        'M 0 0 A 2 2 0 0 0 2 0',
        identityPathTransform(),
      );
      expect(computePathDataBoundingBox(transformed)).toEqual({
        minX: 0,
        minY: 0,
        maxX: 2,
        maxY: expect.closeTo(0.3573, 3),
      });
    });

    test('reverses the sweep of an arc spanning the atan2 discontinuity', () => {
      const transformed: string = applyPathTransformToPathData(
        'M 0 0 A 2 2 0 0 0 0 2',
        identityPathTransform(),
      );
      expect(computePathDataBoundingBox(transformed)).toEqual({
        minX: expect.closeTo(-0.3573, 3),
        minY: 0,
        maxX: 0,
        maxY: 2,
      });
    });

    test('converts a relative arc like an absolute one', () => {
      expect(applyPathTransformToPathData('M 0 0 a 2 2 0 0 1 2 0', identityPathTransform())).toBe(
        applyPathTransformToPathData('M 0 0 A 2 2 0 0 1 2 0', identityPathTransform()),
      );
    });

    test('parses packed arc flags without separators', () => {
      const transformed: string = applyPathTransformToPathData(
        'M 12 21.8 a.13.13 0 01-.075.026',
        identityPathTransform(),
      );
      expect(transformed).toMatch(/^M 12 21.8 C [\d.-]+ [\d.-]+ [\d.-]+ [\d.-]+ 11.925 21.826$/);
    });

    test('converts a large arc into multiple cubic bézier segments', () => {
      const transformed: string = applyPathTransformToPathData(
        'M 0 0 A 2 2 0 1 1 2 0',
        identityPathTransform(),
      );
      expect(transformed.match(/C /g)).toHaveLength(4);
      const boundingBox = computePathDataBoundingBox(transformed);
      expect(boundingBox.minX).toBeCloseTo(-1.166, 3);
      expect(boundingBox.maxX).toBeCloseTo(3.166, 3);
      expect(boundingBox.minY).toBeCloseTo(-3.732, 3);
      expect(boundingBox.maxY).toBeCloseTo(0, 3);
    });

    test('scales out-of-range arc radii', () => {
      const transformed: string = applyPathTransformToPathData(
        'M 0 0 A 1 1 0 0 1 3 1',
        identityPathTransform(),
      );
      const boundingBox = computePathDataBoundingBox(transformed);
      expect(boundingBox.minX).toBeCloseTo(0, 3);
      expect(boundingBox.maxX).toBeCloseTo(3.276, 3);
      expect(boundingBox.minY).toBeCloseTo(-1.276, 3);
      expect(boundingBox.maxY).toBeCloseTo(1, 3);
    });

    test('omits an arc with a zero-length chord', () => {
      expect(applyPathTransformToPathData('M 1 1 A 1 1 0 0 1 1 1', identityPathTransform())).toBe(
        'M 1 1',
      );
    });

    test('converts an arc with degenerate radii to a line', () => {
      expect(applyPathTransformToPathData('M 1 1 A 0 1 0 0 1 4 5', identityPathTransform())).toBe(
        'M 1 1 C 2 2.3333 3 3.6667 4 5',
      );
    });

    test('handles Figma-style compact path data with curves', () => {
      expect(
        applyPathTransformToPathData('M8.025 18.5625C7.78 18.14 7.24 18 6.82 18.2423Z', [
          [1, 0, 1],
          [0, 1, -1],
        ]),
      ).toBe('M 9.025 17.5625 C 8.78 17.14 8.24 17 7.82 17.2423 Z');
    });

    test('trims floating point noise', () => {
      expect(
        applyPathTransformToPathData('M 0.1 0.2', [
          [3, 0, 0],
          [0, 3, 0],
        ]),
      ).toBe('M 0.3 0.6');
    });

    test('formats negative zero as zero', () => {
      expect(
        applyPathTransformToPathData('M 1 1 L -2 -2', [
          [0, 0, 0],
          [0, 0, 0],
        ]),
      ).toBe('M 0 0 L 0 0');
    });

    test('throws on an unsupported command', () => {
      expect(() => applyPathTransformToPathData('B 1 2', identityPathTransform())).toThrow(
        'Unsupported path command "B".',
      );
    });

    test('throws on a stray character where a coordinate is expected', () => {
      expect(() => applyPathTransformToPathData('M 1 2 )', identityPathTransform())).toThrow(
        'Malformed path data: expected a number at offset 6 in "M 1 2 )".',
      );
    });

    test('throws on an invalid arc flag', () => {
      expect(() =>
        applyPathTransformToPathData('a 1 1 0 2 0 4 5', identityPathTransform()),
      ).toThrow('Malformed path data: expected a flag at offset 8 in "a 1 1 0 2 0 4 5".');
    });

    test('throws when the path data starts with a coordinate', () => {
      expect(() => applyPathTransformToPathData('1 2', identityPathTransform())).toThrow(
        'Path data starts with a coordinate: "1 2"',
      );
    });

    test('throws on leftover coordinates', () => {
      expect(() => applyPathTransformToPathData('M 1 2 3', identityPathTransform())).toThrow(
        'Malformed path data: 3 coordinates for command "M".',
      );
    });

    test('throws on incomplete curve coordinates', () => {
      expect(() => applyPathTransformToPathData('C 1 2', identityPathTransform())).toThrow(
        'Malformed path data: 2 coordinates for command "C".',
      );
    });

    test('throws on coordinates attached to a close command', () => {
      expect(() => applyPathTransformToPathData('Z 1 2', identityPathTransform())).toThrow(
        'Malformed path data: 2 coordinates for command "Z".',
      );
    });
  });

  describe('composePathTransforms', () => {
    test('composes a scale inside a translation', () => {
      const composed = composePathTransforms(
        [
          [1, 0, 10],
          [0, 1, 20],
        ],
        [
          [2, 0, 0],
          [0, 2, 0],
        ],
      );
      expect(applyPathTransformToPathData('M 1 1', composed)).toBe('M 12 22');
    });
  });

  describe('computePathDataBoundingBox', () => {
    test('computes the bounding box including curve control points', () => {
      expect(computePathDataBoundingBox('M 1 2 C 0 5 4 6 3 3 L -1 0 Z')).toEqual({
        minX: -1,
        minY: 0,
        maxX: 4,
        maxY: 6,
      });
    });

    test('throws on empty path data', () => {
      expect(() => computePathDataBoundingBox('')).toThrow('Empty path data: ""');
    });

    test('throws on a path without points', () => {
      expect(() => computePathDataBoundingBox('Z')).toThrow('Empty path data: "Z"');
    });

    test('computes the bounding box of multiple path data strings independently', () => {
      expect(computePathsBoundingBox(['M 2 0 L 4 0', 'm 1 1 L 3 3 Z'])).toEqual({
        minX: 1,
        minY: 0,
        maxX: 4,
        maxY: 3,
      });
    });
  });
});
