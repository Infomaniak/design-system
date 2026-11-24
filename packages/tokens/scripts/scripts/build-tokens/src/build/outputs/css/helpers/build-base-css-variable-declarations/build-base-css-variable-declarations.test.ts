import { describe, expect, it } from 'vitest';
import { DesignTokensCollection } from '../../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokensCollectionTokenToCssVariableDeclarationOptions } from '../../../../../../../../shared/dtcg/resolver/to/css/token/design-tokens-collection-token-to-css-variable-declaration.ts';
import { createCssVariableNameGenerator } from '../../../../../../../../shared/dtcg/resolver/to/css/token/name/create-css-variable-name-generator.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { buildBaseCssVariableDeclarations } from './build-base-css-variable-declarations.ts';

const CSS_OPTIONS: DesignTokensCollectionTokenToCssVariableDeclarationOptions = {
  generateCssVariableName: createCssVariableNameGenerator({ prefix: 'esds' }),
};

function createColorToken(
  name: readonly string[],
  value: GenericDesignTokensCollectionToken['value'],
  type?: string,
): GenericDesignTokensCollectionToken {
  return {
    files: ['/t2/color.tokens.json'],
    name: [...name],
    type,
    value,
  } as GenericDesignTokensCollectionToken;
}

function createHexColor(hex: string): GenericDesignTokensCollectionToken['value'] {
  return {
    colorSpace: 'srgb',
    components: [0.53, 0.53, 0.53],
    hex,
  };
}

describe('buildBaseCssVariableDeclarations', () => {
  it('pairs every base token with its css variable declaration', () => {
    const collection: DesignTokensCollection = new DesignTokensCollection();

    collection.add(createColorToken(['color', 'gray', '500'], createHexColor('#888888'), 'color'), {
      merge: false,
    });

    const declarations = buildBaseCssVariableDeclarations(collection, CSS_OPTIONS);

    expect(declarations.length).toBe(1);
    expect(declarations[0]!.token.name).toEqual(['color', 'gray', '500']);
    expect(declarations[0]!.declaration.name).toBe('--esds-color-gray-500');
    expect(declarations[0]!.declaration.value).toBe('#878787');
  });

  it('resolves the type of an alias token through its reference', () => {
    const collection: DesignTokensCollection = new DesignTokensCollection();

    collection.add(createColorToken(['color', 'background', 'brand'], '{color.gray.500}'), {
      merge: false,
    });
    collection.add(createColorToken(['color', 'gray', '500'], createHexColor('#888888'), 'color'), {
      merge: false,
    });

    const declarations = buildBaseCssVariableDeclarations(collection, CSS_OPTIONS);

    expect(declarations[0]!.declaration.name).toBe('--esds-color-background-brand');
    expect(declarations[0]!.declaration.value).toBe('var(--esds-color-gray-500)');
  });
});
