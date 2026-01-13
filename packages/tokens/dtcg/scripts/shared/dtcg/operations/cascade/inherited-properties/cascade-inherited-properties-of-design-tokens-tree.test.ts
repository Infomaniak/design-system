import { describe, expect, test } from 'vitest';
import { cascadeInheritedPropertiesOfDesignTokensTree } from './cascade-inherited-properties-of-design-tokens-tree.ts';

describe('cascadeInheritedPropertiesOfDesignTokensTree', () => {
  test('cascade on all', () => {
    expect(
      cascadeInheritedPropertiesOfDesignTokensTree({
        color: {
          $type: 'color',
          black: {
            '100': {
              $value: {
                colorSpace: 'srgb',
                components: [0.047058823529411764, 0.047058823529411764, 0.050980392156862744],
                alpha: 0.050980392156862744,
                hex: '#0c0c0d',
              },
            },
            '200': {
              $type: 'dimension',
              $value: { value: 12, unit: 'rem' },
            },
          },
        },
      }),
    ).toEqual({
      color: {
        $type: 'color',
        black: {
          '100': {
            $type: 'color',
            $value: {
              colorSpace: 'srgb',
              components: [0.047058823529411764, 0.047058823529411764, 0.050980392156862744],
              alpha: 0.050980392156862744,
              hex: '#0c0c0d',
            },
          },
          '200': { $type: 'dimension', $value: { value: 12, unit: 'rem' } },
          $type: 'color',
        },
      },
    });
  });

  test('cascade on origin and token', () => {
    expect(
      cascadeInheritedPropertiesOfDesignTokensTree(
        {
          size: {
            $type: 'number',
            xs: {
              '100': {
                $value: 100,
              },
            },
          },
        },
        ['origin', 'token'],
      ),
    ).toEqual({
      size: {
        $type: 'number',
        xs: {
          '100': {
            $type: 'number',
            $value: 100,
          },
        },
      },
    });
  });

  test('cascade on token', () => {
    expect(
      cascadeInheritedPropertiesOfDesignTokensTree(
        {
          size: {
            $type: 'number',
            xs: {
              '100': {
                $value: 100,
              },
            },
          },
        },
        ['token'],
      ),
    ).toEqual({
      size: {
        xs: {
          '100': {
            $type: 'number',
            $value: 100,
          },
        },
      },
    });
  });
});
