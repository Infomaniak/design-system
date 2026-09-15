import { describe, expect, test } from 'vitest';
import {
  applyPathTransformToPathData,
  composePathTransforms,
  computePathDataBoundingBox,
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

    test('resolves relative commands', () => {
      expect(applyPathTransformToPathData('m 1 2 l 3 4', identityPathTransform())).toBe(
        'M 1 2 L 4 6',
      );
    });

    test('treats a relative moveto at the start as absolute', () => {
      expect(applyPathTransformToPathData('m 1 2', identityPathTransform())).toBe('M 1 2');
    });

    test('normalizes implicit relative line commands after a relative move', () => {
      expect(applyPathTransformToPathData('m 1 2 3 4', identityPathTransform())).toBe(
        'M 1 2 L 4 6',
      );
    });

    test('resolves horizontal and vertical shorthands', () => {
      expect(applyPathTransformToPathData('M 1 2 H 5 V 7', identityPathTransform())).toBe(
        'M 1 2 L 5 2 L 5 7',
      );
    });

    test('resolves relative horizontal and vertical shorthands', () => {
      expect(applyPathTransformToPathData('M 1 2 h 3 v 4', identityPathTransform())).toBe(
        'M 1 2 L 4 2 L 4 6',
      );
    });

    test('resolves the smooth cubic shorthand by reflecting the previous control point', () => {
      expect(
        applyPathTransformToPathData('M 0 0 C 1 1 2 1 3 0 S 5 -1 6 0', identityPathTransform()),
      ).toBe('M 0 0 C 1 1 2 1 3 0 C 4 -1 5 -1 6 0');
    });

    test('falls back to the current point for a smooth cubic shorthand without a previous curve', () => {
      expect(applyPathTransformToPathData('M 1 1 S 2 2 3 3', identityPathTransform())).toBe(
        'M 1 1 C 1 1 2 2 3 3',
      );
    });

    test('resolves the smooth quadratic shorthand by reflecting the previous control point', () => {
      expect(applyPathTransformToPathData('M 0 0 Q 1 1 2 0 T 4 0', identityPathTransform())).toBe(
        'M 0 0 Q 1 1 2 0 Q 3 -1 4 0',
      );
    });

    test('falls back to the current point for a smooth quadratic shorthand without a previous curve', () => {
      expect(applyPathTransformToPathData('M 1 1 T 2 2', identityPathTransform())).toBe(
        'M 1 1 Q 1 1 2 2',
      );
    });

    test('resolves relative curves', () => {
      expect(applyPathTransformToPathData('M 1 2 c 1 1 2 2 3 3', identityPathTransform())).toBe(
        'M 1 2 C 2 3 3 4 4 5',
      );
    });

    test('restarts relative coordinates from the subpath start after a close', () => {
      expect(applyPathTransformToPathData('M 1 1 L 3 1 Z l 1 1', identityPathTransform())).toBe(
        'M 1 1 L 3 1 Z L 2 2',
      );
    });

    test('parses exponent notation', () => {
      expect(applyPathTransformToPathData('M 1e1 2e-1', identityPathTransform())).toBe('M 10 0.2');
    });

    test('throws on non-finite coordinates', () => {
      expect(() => applyPathTransformToPathData('M 1e999 0', identityPathTransform())).toThrow(
        'Non-finite number in path data: "M 1e999 0".',
      );
    });

    test('throws on non-finite arc geometry from degenerate radii', () => {
      expect(() =>
        applyPathTransformToPathData('M 0 0 A 1e-300 1e-300 0 0 1 2 0', identityPathTransform()),
      ).toThrow('Non-finite arc geometry in path data:');
    });

    test('throws on non-finite transformed coordinates', () => {
      expect(() =>
        applyPathTransformToPathData('M 1 1', [
          [Infinity, 0, 0],
          [0, 1, 0],
        ]),
      ).toThrow('Non-finite number in path data: Infinity.');
    });

    test('converts a quarter circle arc into a cubic bézier', () => {
      expect(applyPathTransformToPathData('M 1 0 A 1 1 0 0 1 0 1', identityPathTransform())).toBe(
        'M 1 0 C 1 0.5523 0.5523 1 0 1',
      );
    });

    test('converts a negative sweep arc into a cubic bézier', () => {
      expect(applyPathTransformToPathData('M 1 0 A 1 1 0 0 0 0 -1', identityPathTransform())).toBe(
        'M 1 0 C 1 -0.5523 0.5523 -1 0 -1',
      );
    });

    test('is rotation-invariant for circular arcs', () => {
      expect(applyPathTransformToPathData('M 1 0 A 1 1 90 0 1 0 1', identityPathTransform())).toBe(
        applyPathTransformToPathData('M 1 0 A 1 1 0 0 1 0 1', identityPathTransform()),
      );
    });

    test('converts an elliptical arc into a cubic bézier', () => {
      expect(applyPathTransformToPathData('M 2 0 A 2 1 0 0 1 0 1', identityPathTransform())).toBe(
        'M 2 0 C 2 0.5523 1.1046 1 0 1',
      );
    });

    test('splits large arcs into segments of at most 90 degrees', () => {
      expect(applyPathTransformToPathData('M 1 0 A 1 1 0 1 1 0 -1', identityPathTransform())).toBe(
        'M 1 0 C 1 0.5523 0.5523 1 0 1 C -0.5523 1 -1 0.5523 -1 0 C -1 -0.5523 -0.5523 -1 0 -1',
      );
    });

    test('scales radii up when the endpoints are too far apart', () => {
      expect(
        applyPathTransformToPathData('M 0 0 A 0.5 0.5 0 0 1 2 0', identityPathTransform()),
      ).toBe('M 0 0 C 0 -0.5523 0.4477 -1 1 -1 C 1.5523 -1 2 -0.5523 2 0');
    });

    test('treats an arc with a zero radius as a line', () => {
      expect(applyPathTransformToPathData('M 0 0 A 0 1 0 0 1 2 3', identityPathTransform())).toBe(
        'M 0 0 L 2 3',
      );
    });

    test('omits a zero-length arc', () => {
      expect(applyPathTransformToPathData('M 1 1 A 1 1 0 0 1 1 1', identityPathTransform())).toBe(
        'M 1 1',
      );
    });

    test('treats a relative shorthand without a current point as absolute', () => {
      expect(applyPathTransformToPathData('h 3 v 4', identityPathTransform())).toBe('L 3 0 L 3 4');
      expect(applyPathTransformToPathData('v 4', identityPathTransform())).toBe('L 0 4');
    });

    test('resolves relative smooth shorthands', () => {
      expect(
        applyPathTransformToPathData('M 0 0 C 1 1 2 1 3 0 s 2 -1 3 0', identityPathTransform()),
      ).toBe('M 0 0 C 1 1 2 1 3 0 C 4 -1 5 -1 6 0');
    });

    test('resolves relative quadratic curves', () => {
      expect(applyPathTransformToPathData('M 1 1 q 1 1 2 2', identityPathTransform())).toBe(
        'M 1 1 Q 2 2 3 3',
      );
    });

    test('resolves relative smooth quadratic shorthands', () => {
      expect(applyPathTransformToPathData('M 1 1 t 2 2', identityPathTransform())).toBe(
        'M 1 1 Q 1 1 3 3',
      );
    });

    test('falls back to the origin for a leading smooth cubic shorthand', () => {
      expect(applyPathTransformToPathData('S 2 2 3 3', identityPathTransform())).toBe(
        'C 0 0 2 2 3 3',
      );
    });

    test('converts a large negative-sweep arc into cubic béziers', () => {
      expect(
        applyPathTransformToPathData('M 1 0 A 1 1 0 1 0 0 -1', identityPathTransform()),
      ).toMatch(/^M 1 0 C( [-\d.]+){6} C( [-\d.]+){6} C( [-\d.]+){4} 0 -1$/);
    });

    test('converts an arc without a current point from the origin', () => {
      expect(applyPathTransformToPathData('A 1 1 0 0 1 2 3', identityPathTransform())).toMatch(
        /^C( [-\d.]+){6} C( [-\d.]+){4} 2 3$/,
      );
    });

    test('parses SVGO-optimized path data with flags abutting numbers', () => {
      expect(
        applyPathTransformToPathData(
          'M14.173 15.714a.875.875 0 001.654.572L15 16z',
          identityPathTransform(),
        ),
      ).toMatch(
        /^M 14\.173 15\.714 C [-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+ C [-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+ 15\.827 16\.286 L 15 16 Z$/,
      );
    });

    test('throws on an unexpected character', () => {
      expect(() => applyPathTransformToPathData('M 1 2 # 3 4', identityPathTransform())).toThrow(
        'Unexpected character "#" in path data: "M 1 2 # 3 4".',
      );
    });

    test('throws on incomplete arc coordinates', () => {
      expect(() => applyPathTransformToPathData('A 1', identityPathTransform())).toThrow(
        'Malformed path data: 1 coordinates for command "A".',
      );
      expect(() => applyPathTransformToPathData('A 1 2', identityPathTransform())).toThrow(
        'Malformed path data: 2 coordinates for command "A".',
      );
      expect(() => applyPathTransformToPathData('A 1 2 3', identityPathTransform())).toThrow(
        'Malformed path data: 3 coordinates for command "A".',
      );
      expect(() => applyPathTransformToPathData('A 1 2 3 0', identityPathTransform())).toThrow(
        'Malformed path data: 4 coordinates for command "A".',
      );
      expect(() => applyPathTransformToPathData('A 1 2 3 0 0', identityPathTransform())).toThrow(
        'Malformed path data: 5 coordinates for command "A".',
      );
      expect(() => applyPathTransformToPathData('A 1 2 3 0 0 5', identityPathTransform())).toThrow(
        'Malformed path data: 6 coordinates for command "A".',
      );
    });

    test('throws on an invalid arc flag', () => {
      expect(() =>
        applyPathTransformToPathData('A 1 2 3 2 0 1 1', identityPathTransform()),
      ).toThrow('Malformed path data: 3 coordinates for command "A".');
    });

    test('throws on an unexpected character after a close command', () => {
      expect(() => applyPathTransformToPathData('Z #', identityPathTransform())).toThrow(
        'Unexpected character "#" in path data: "Z #".',
      );
    });

    test('throws on an unexpected character after an arc command', () => {
      expect(() => applyPathTransformToPathData('A #', identityPathTransform())).toThrow(
        'Unexpected character "#" in path data: "A #".',
      );
    });

    test('ignores a command without coordinates', () => {
      expect(applyPathTransformToPathData('M 1 2 L', identityPathTransform())).toBe('M 1 2');
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

    test('computes the bounding box of shorthanded path data', () => {
      expect(computePathDataBoundingBox('m 1 2 h 3 v 4')).toEqual({
        minX: 1,
        minY: 2,
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
  });
});
