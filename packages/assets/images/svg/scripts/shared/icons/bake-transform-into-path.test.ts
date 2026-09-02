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

    test('throws on an unsupported command', () => {
      expect(() =>
        applyPathTransformToPathData('A 1 2 3 4 5 6 7', identityPathTransform()),
      ).toThrow('Unsupported path command "A".');
    });

    test('throws on a lowercase command', () => {
      expect(() => applyPathTransformToPathData('m 1 2', identityPathTransform())).toThrow(
        'Unsupported path command "m".',
      );
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
  });
});
