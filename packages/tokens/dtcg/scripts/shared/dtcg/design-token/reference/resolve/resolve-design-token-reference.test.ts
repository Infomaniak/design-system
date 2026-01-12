import { describe, expect, test } from 'vitest';
import { resolveDesignTokenReference } from './resolve-design-token-reference.js';

describe('resolveDesignTokenReference', () => {
  test('recursivity', () => {
    expect(
      resolveDesignTokenReference('{semantic.link}', {
        base: {
          primary: {
            $value: {
              colorSpace: 'srgb',
              components: [0, 0.4, 0.8],
              hex: '#0066cc',
            },
            $type: 'color',
          },
        },
        semantic: {
          brand: {
            $value: '{base.primary}',
            $type: 'color',
          },
          link: {
            $value: '{semantic.brand}',
            $type: 'color',
          },
        },
      }).value,
    ).toEqual({
      colorSpace: 'srgb',
      components: [0, 0.4, 0.8],
      hex: '#0066cc',
    });
  });

  test('circular', () => {
    expect(
      () =>
        resolveDesignTokenReference('{a}', {
          a: { $value: '{b}' },
          b: { $value: '{c}' },
          c: { $value: '{a}' }, // Creates circular reference: a → b → c → a
        }).value,
    ).toThrow();
  });
});
