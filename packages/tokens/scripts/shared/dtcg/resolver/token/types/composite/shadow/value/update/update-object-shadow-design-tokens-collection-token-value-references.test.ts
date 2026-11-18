import { describe, expect, test } from 'vitest';
import type { CurlyReference } from '../../../../../../../design-token/reference/types/curly/curly-reference.ts';
import type { UpdateCurlyReference } from '../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../types/object/object-shadow-design-tokens-collection-token-value.ts';
import { updateObjectShadowDesignTokensCollectionTokenValueReferences } from './update-object-shadow-design-tokens-collection-token-value-references.ts';

const FROM = '{color.gray.700}';
const TO = '{color.gray.500}';

const update: UpdateCurlyReference = (reference): CurlyReference => {
  return reference === FROM ? TO : reference;
};

const objectValue = (): ObjectShadowDesignTokensCollectionTokenValue => {
  return {
    offsetX: '{dimension.0}',
    offsetY: '{dimension.1}',
    blur: '{blur.1}',
    spread: FROM,
    color: {
      colorSpace: 'srgb',
      components: FROM,
      alpha: 0.3,
    },
  };
};

describe('updateObjectShadowDesignTokensCollectionTokenValueReferences', () => {
  test('should update the references of a value', () => {
    expect(
      updateObjectShadowDesignTokensCollectionTokenValueReferences(objectValue(), update),
    ).toStrictEqual({
      offsetX: '{dimension.0}',
      offsetY: '{dimension.1}',
      blur: '{blur.1}',
      spread: TO,
      color: {
        colorSpace: 'srgb',
        components: TO,
        alpha: 0.3,
      },
    });
  });

  test('should keep the color untouched when it is a literal value', () => {
    const value: ObjectShadowDesignTokensCollectionTokenValue = {
      offsetX: '{dimension.0}',
      offsetY: '{dimension.1}',
      blur: '{blur.1}',
      spread: '{dimension.0}',
      color: {
        colorSpace: 'srgb',
        components: [0, 0, 0],
        alpha: 0.3,
      },
    };

    expect(
      updateObjectShadowDesignTokensCollectionTokenValueReferences(value, update),
    ).toStrictEqual(value);
  });

  test('should update the whole color when it is a reference', () => {
    const value: ObjectShadowDesignTokensCollectionTokenValue = {
      offsetX: '{dimension.0}',
      offsetY: '{dimension.1}',
      blur: '{blur.1}',
      spread: '{dimension.0}',
      color: FROM,
    };

    expect(
      updateObjectShadowDesignTokensCollectionTokenValueReferences(value, update),
    ).toStrictEqual({
      ...value,
      color: TO,
    });
  });
});
