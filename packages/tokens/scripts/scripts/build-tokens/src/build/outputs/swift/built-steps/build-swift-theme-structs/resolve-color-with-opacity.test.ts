import { describe, expect, test } from 'vitest';
import { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import {
  isColorTokenWithReferenceMembers,
  resolveColorWithOpacitySwiftValue,
  type ColorWithOpacityResolutionContext,
} from './resolve-color-with-opacity.ts';

function createCollection(
  tokens: readonly GenericDesignTokensCollectionToken[],
): DesignTokensCollection {
  return new DesignTokensCollection(tokens);
}

const T1_RED: GenericDesignTokensCollectionToken = {
  files: ['/tokens/t1-primitive/color.tokens.json'],
  name: ['color', 'red', '500'],
  type: 'color',
  value: { hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb' },
};

const T1_OPACITY_MEDIUM: GenericDesignTokensCollectionToken = {
  files: ['/tokens/t1-primitive/opacity.tokens.json'],
  name: ['opacity', 'medium'],
  type: 'number',
  value: 0.5,
};

function createContext(collection: DesignTokensCollection): ColorWithOpacityResolutionContext {
  return {
    productCollection: collection,
    themeCollection: collection,
    themePathFragment: '',
    rawTokensPrefix: 'PrimitiveToken',
  };
}

describe('isColorTokenWithReferenceMembers', () => {
  test('should return true when components is a curly reference', () => {
    const token = {
      name: ['color', 'accent'],
      value: { colorSpace: 'srgb', components: '{color.red.500}' },
    } as unknown as GenericDesignTokensCollectionToken;

    expect(isColorTokenWithReferenceMembers(token)).toBe(true);
  });

  test('should return true when alpha is a curly reference', () => {
    const token = {
      name: ['color', 'accent'],
      value: { colorSpace: 'srgb', components: [1, 0, 0], alpha: '{opacity.medium}' },
    } as unknown as GenericDesignTokensCollectionToken;

    expect(isColorTokenWithReferenceMembers(token)).toBe(true);
  });

  test('should return false for a literal color value', () => {
    expect(isColorTokenWithReferenceMembers(T1_RED as GenericDesignTokensCollectionToken)).toBe(
      false,
    );
  });

  test('should return false for non-object values', () => {
    const token = {
      name: ['color', 'accent'],
      value: '{color.red.500}',
    } as unknown as GenericDesignTokensCollectionToken;

    expect(isColorTokenWithReferenceMembers(token)).toBe(false);
  });
});

describe('resolveColorWithOpacitySwiftValue', () => {
  test('should resolve a T1 color without references to its raw token value', () => {
    const collection = createCollection([T1_RED, T1_OPACITY_MEDIUM]);

    expect(
      resolveColorWithOpacitySwiftValue(['color', 'red', '500'], createContext(collection)),
    ).toBe('PrimitiveToken.Color.red500');
  });

  test('should chase a whole-value alias up to the T1 color', () => {
    const collection = createCollection([
      T1_RED,
      T1_OPACITY_MEDIUM,
      {
        files: ['/tokens/t2-semantic/color.tokens.json'],
        name: ['color', 'accent'],
        type: 'color',
        value: '{color.red.500}',
      },
    ]);

    expect(resolveColorWithOpacitySwiftValue(['color', 'accent'], createContext(collection))).toBe(
      'PrimitiveToken.Color.red500',
    );
  });

  test('should append .opacity() for referenced alpha', () => {
    const collection = createCollection([
      T1_RED,
      T1_OPACITY_MEDIUM,
      {
        files: ['/tokens/t2-semantic/color.tokens.json'],
        name: ['color', 'accent', 'dim'],
        type: 'color',
        value: { colorSpace: 'srgb', components: '{color.red.500}', alpha: '{opacity.medium}' },
      },
    ]);

    expect(
      resolveColorWithOpacitySwiftValue(['color', 'accent', 'dim'], createContext(collection)),
    ).toBe('PrimitiveToken.Color.red500.opacity(PrimitiveToken.Opacity.medium)');
  });

  test('should use a literal alpha without .opacity() wrapping', () => {
    const collection = createCollection([
      T1_RED,
      T1_OPACITY_MEDIUM,
      {
        files: ['/tokens/t2-semantic/color.tokens.json'],
        name: ['color', 'accent', 'dim'],
        type: 'color',
        value: { colorSpace: 'srgb', components: '{color.red.500}', alpha: 0.5 },
      },
    ]);

    expect(
      resolveColorWithOpacitySwiftValue(['color', 'accent', 'dim'], createContext(collection)),
    ).toBe('PrimitiveToken.Color.red500.opacity(0.5)');
  });

  test('should return the base color unchanged when no alpha is set', () => {
    const collection = createCollection([
      T1_RED,
      T1_OPACITY_MEDIUM,
      {
        files: ['/tokens/t2-semantic/color.tokens.json'],
        name: ['color', 'accent'],
        type: 'color',
        value: { colorSpace: 'srgb', components: '{color.red.500}' },
      },
    ]);

    expect(resolveColorWithOpacitySwiftValue(['color', 'accent'], createContext(collection))).toBe(
      'PrimitiveToken.Color.red500',
    );
  });

  test('should throw when the referenced components color is translucent', () => {
    const collection = createCollection([
      {
        ...T1_RED,
        name: ['color', 'red', 'soft'],
        value: { hex: '#ff0000', components: [1, 0, 0], colorSpace: 'srgb', alpha: 0.4 },
      },
      T1_OPACITY_MEDIUM,
      {
        files: ['/tokens/t2-semantic/color.tokens.json'],
        name: ['color', 'accent', 'dim'],
        type: 'color',
        value: {
          colorSpace: 'srgb',
          components: '{color.red.soft}',
          alpha: '{opacity.medium}',
        },
      },
    ]);

    expect(() =>
      resolveColorWithOpacitySwiftValue(['color', 'accent', 'dim'], createContext(collection)),
    ).toThrow('which already has an alpha');
  });

  test('should throw for literal components with a referenced alpha', () => {
    const collection = createCollection([
      T1_RED,
      T1_OPACITY_MEDIUM,
      {
        files: ['/tokens/t2-semantic/color.tokens.json'],
        name: ['color', 'accent', 'dim'],
        type: 'color',
        value: { colorSpace: 'srgb', components: [1, 0, 0], alpha: '{opacity.medium}' },
      },
    ]);

    expect(() =>
      resolveColorWithOpacitySwiftValue(['color', 'accent', 'dim'], createContext(collection)),
    ).toThrow('literal color components with a referenced alpha');
  });

  test('should throw when the alpha reference does not reach a T1 token', () => {
    const collection = createCollection([
      T1_RED,
      T1_OPACITY_MEDIUM,
      {
        files: ['/tokens/t2-semantic/opacity.tokens.json'],
        name: ['opacity', 'soft'],
        type: 'number',
        value: 0.25,
      },
      {
        files: ['/tokens/t2-semantic/color.tokens.json'],
        name: ['color', 'accent', 'dim'],
        type: 'color',
        value: { colorSpace: 'srgb', components: '{color.red.500}', alpha: '{opacity.soft}' },
      },
    ]);

    expect(() =>
      resolveColorWithOpacitySwiftValue(['color', 'accent', 'dim'], createContext(collection)),
    ).toThrow('cannot be resolved to a T1 token');
  });

  test('should throw when the reference chain is too deep', () => {
    const aliases: GenericDesignTokensCollectionToken[] = Array.from(
      { length: 40 },
      (_, index: number): GenericDesignTokensCollectionToken => ({
        files: ['/tokens/t2-semantic/color.tokens.json'],
        name: ['color', 'chain', String(index)],
        type: 'color',
        value: index === 39 ? '{color.red.500}' : '{color.chain.' + String(index + 1) + '}',
      }),
    );
    const collection = createCollection([T1_RED, T1_OPACITY_MEDIUM, ...aliases]);

    expect(() =>
      resolveColorWithOpacitySwiftValue(['color', 'chain', '0'], createContext(collection)),
    ).toThrow('Reference chain too deep');
  });
});
