import { describe, expect, test } from 'vitest';
import { resolveJsonReference } from './resolve-json-reference.ts';

describe('resolveJsonReference', () => {
  test('recursivity', () => {
    expect(
      resolveJsonReference(
        { $ref: '#' },
        {
          definitions: {
            A: {
              $ref: '#/definitions/B',
            },
            B: {
              $ref: '#/definitions/C',
            },
            C: {
              type: 'string',
            },
          },
          $ref: '#/definitions/A',
        },
      ).value,
    ).toEqual({ type: 'string' });
  });

  test('get expected reference', () => {
    const tree = {
      base: {
        spacing: {
          $value: { value: 16, unit: 'px' },
          $type: 'dimension',
        },
      },
      layout: {
        small: {
          $value: {
            value: { $ref: '#/base/spacing/$value/value' },
            unit: 'rem',
          },
          $type: 'dimension',
        },
        large: {
          $value: {
            value: 32,
            unit: { $ref: '#/base/spacing/$value/unit' },
          },
          $type: 'dimension',
        },
      },
    };

    expect(resolveJsonReference({ $ref: '#/layout/small/$value/value' }, tree).value).toBe(16);

    expect(resolveJsonReference({ $ref: '#/layout/large/$value/unit' }, tree).value).toBe('px');
  });

  test('circular', () => {
    expect(
      () =>
        resolveJsonReference(
          { $ref: '#/a' },
          {
            a: {
              $ref: '#/b',
            },
            b: {
              $ref: '#/a',
            },
          },
        ).value,
    ).toThrow();
  });
});
