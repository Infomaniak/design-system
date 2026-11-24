import { describe, expect, it } from 'vitest';
import { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { DesignTokensCollectionTokenToCssVariableDeclarationOptions } from '../../../../../../../../shared/dtcg/resolver/to/css/token/design-tokens-collection-token-to-css-variable-declaration.ts';
import { createCssVariableNameGenerator } from '../../../../../../../../shared/dtcg/resolver/to/css/token/name/create-css-variable-name-generator.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { buildBaseCssVariableDeclarations } from '../build-base-css-variable-declarations/build-base-css-variable-declarations.ts';
import { computeDynamicTokenNames } from './compute-dynamic-token-names.ts';

const CSS_OPTIONS: DesignTokensCollectionTokenToCssVariableDeclarationOptions = {
  generateCssVariableName: createCssVariableNameGenerator({ prefix: 'esds' }),
};

function computeNames(
  baseCollection: DesignTokensCollection,
  modifiers: DesignTokenModifiers,
): ReadonlySet<string> {
  return computeDynamicTokenNames({
    baseCollection,
    baseTokenDeclarations: buildBaseCssVariableDeclarations(baseCollection, CSS_OPTIONS),
    modifiers,
    cssOptions: CSS_OPTIONS,
  });
}

function createColorToken(
  name: readonly string[],
  value: GenericDesignTokensCollectionToken['value'],
  files: string = '/t2/color.tokens.json',
): GenericDesignTokensCollectionToken {
  return {
    files: [files],
    name: [...name],
    type: 'color',
    value,
  } as GenericDesignTokensCollectionToken;
}

function createCollection(
  tokens: readonly GenericDesignTokensCollectionToken[],
): DesignTokensCollection {
  const collection: DesignTokensCollection = new DesignTokensCollection();

  for (const token of tokens) {
    collection.add(token, { merge: false });
  }

  return collection;
}

const GRAY_500 = createColorToken(['color', 'gray', '500'], {
  colorSpace: 'srgb',
  components: [0.53, 0.53, 0.53],
  hex: '#888888',
});

const GRAY_100 = createColorToken(['color', 'gray', '100'], {
  colorSpace: 'srgb',
  components: [0.9, 0.9, 0.9],
  hex: '#e6e6e6',
});

const BASE_TOKENS: readonly GenericDesignTokensCollectionToken[] = [
  GRAY_500,
  GRAY_100,
  createColorToken(['color', 'background', 'brand'], '{color.gray.500}'),
  createColorToken(['color', 'background', 'surface'], '{color.gray.100}'),
  createColorToken(
    ['button', 'background', 'color'],
    '{color.background.brand}',
    '/t3/button.tokens.json',
  ),
  createColorToken(
    ['card', 'background', 'color'],
    '{color.background.surface}',
    '/t3/card.tokens.json',
  ),
];

function createModifiers(
  overriddenToken: GenericDesignTokensCollectionToken | undefined,
): DesignTokenModifiers {
  const contextTokens: readonly GenericDesignTokensCollectionToken[] =
    overriddenToken === undefined ? BASE_TOKENS : [...BASE_TOKENS, overriddenToken];

  const contextCollection: DesignTokensCollection = createCollection(contextTokens);

  return new Map([['theme', new Map([['dark', contextCollection]])]]);
}

describe('computeDynamicTokenNames', () => {
  it('marks the overridden token as dynamic', () => {
    const darkGray = createColorToken(['color', 'gray', '500'], {
      colorSpace: 'srgb',
      components: [0.1, 0.2, 0.3],
      hex: '#91dfce',
    });

    const names: ReadonlySet<string> = computeNames(
      createCollection(BASE_TOKENS),
      createModifiers(darkGray),
    );

    expect(names.has('--esds-color-gray-500')).toBe(true);
  });

  it('marks direct and transitive referencers of an overridden token as dynamic', () => {
    const darkGray = createColorToken(['color', 'gray', '500'], {
      colorSpace: 'srgb',
      components: [0.1, 0.2, 0.3],
      hex: '#91dfce',
    });

    const names: ReadonlySet<string> = computeNames(
      createCollection(BASE_TOKENS),
      createModifiers(darkGray),
    );

    expect(names.has('--esds-color-background-brand')).toBe(true);
    expect(names.has('--esds-button-background-color')).toBe(true);
  });

  it('does not mark independent alias chains as dynamic', () => {
    const darkGray = createColorToken(['color', 'gray', '500'], {
      colorSpace: 'srgb',
      components: [0.1, 0.2, 0.3],
      hex: '#91dfce',
    });

    const names: ReadonlySet<string> = computeNames(
      createCollection(BASE_TOKENS),
      createModifiers(darkGray),
    );

    expect(names.has('--esds-color-background-surface')).toBe(false);
    expect(names.has('--esds-card-background-color')).toBe(false);
  });

  it('does not mark a token dynamic for a description-only difference', () => {
    const darkGray: GenericDesignTokensCollectionToken = {
      ...createColorToken(['color', 'gray', '500'], {
        colorSpace: 'srgb',
        components: [0.53, 0.53, 0.53],
        hex: '#888888',
      }),
      description: 'A different comment, same value.',
    };

    const names: ReadonlySet<string> = computeNames(
      createCollection(BASE_TOKENS),
      createModifiers(darkGray),
    );

    expect(names.has('--esds-color-gray-500')).toBe(false);
  });

  it('unions overrides across contexts and modifiers', () => {
    const darkGray = createColorToken(['color', 'gray', '500'], {
      colorSpace: 'srgb',
      components: [0.1, 0.2, 0.3],
      hex: '#91dfce',
    });
    const darkGray100 = createColorToken(['color', 'gray', '100'], {
      colorSpace: 'srgb',
      components: [0.2, 0.2, 0.2],
      hex: '#333333',
    });

    const modifiers: DesignTokenModifiers = new Map([
      [
        'theme',
        new Map([
          ['dark', createCollection([...BASE_TOKENS, darkGray])],
          ['dim', createCollection([...BASE_TOKENS, darkGray100])],
        ]),
      ],
    ]);

    const names: ReadonlySet<string> = computeNames(createCollection(BASE_TOKENS), modifiers);

    expect(names.has('--esds-color-gray-500')).toBe(true);
    expect(names.has('--esds-color-gray-100')).toBe(true);
    expect(names.has('--esds-color-background-surface')).toBe(true);
    expect(names.has('--esds-color-background-brand')).toBe(true);
  });
});
