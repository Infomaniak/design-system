import { describe, expect, test } from 'vitest';
import { resolveDesignTokenReference } from './resolve-design-token-reference.ts';

describe('resolveDesignTokenReference', () => {
  test('recursivity', () => {
    expect(
      resolveDesignTokenReference('{semantic.link}', {
        base: {
          $type: 'color',
          primary: {
            $value: {
              colorSpace: 'srgb',
              components: [0, 0.4, 0.8],
              hex: '#0066cc',
            },
          },
        },
        semantic: {
          brand: {
            $value: '{base.primary}',
          },
          link: {
            $value: '{semantic.brand}',
          },
        },
      }).token,
    ).toEqual({
      $type: 'color',
      $value: {
        colorSpace: 'srgb',
        components: [0, 0.4, 0.8],
        hex: '#0066cc',
      },
    });
  });

  test('circular', () => {
    expect(
      () =>
        resolveDesignTokenReference('{a}', {
          a: { $value: '{b}' },
          b: { $value: '{c}' },
          c: { $value: '{a}' }, // Creates circular reference: a → b → c → a
        }).token,
    ).toThrow();
  });
});
