import { describe, expect, test } from 'vitest';
import type { CurlyReference } from '../../../../../../../design-token/reference/types/curly/curly-reference.ts';
import type { UpdateCurlyReference } from '../../../../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import type { ObjectShadowDesignTokensCollectionTokenValue } from '../types/object/object-shadow-design-tokens-collection-token-value.ts';
import { updateShadowDesignTokensCollectionTokenValueReferences } from './update-shadow-design-tokens-collection-token-value-references.ts';

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

describe('updateShadowDesignTokensCollectionTokenValueReferences', () => {
  test('should update the references of an object value', () => {
    expect(
      updateShadowDesignTokensCollectionTokenValueReferences(objectValue(), update),
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

  test('should update the references of an object array value', () => {
    expect(
      updateShadowDesignTokensCollectionTokenValueReferences(
        [objectValue(), objectValue()],
        update,
      ),
    ).toStrictEqual([
      {
        offsetX: '{dimension.0}',
        offsetY: '{dimension.1}',
        blur: '{blur.1}',
        spread: TO,
        color: {
          colorSpace: 'srgb',
          components: TO,
          alpha: 0.3,
        },
      },
      {
        offsetX: '{dimension.0}',
        offsetY: '{dimension.1}',
        blur: '{blur.1}',
        spread: TO,
        color: {
          colorSpace: 'srgb',
          components: TO,
          alpha: 0.3,
        },
      },
    ]);
  });

  test('should update the whole-value references of an object array value', () => {
    expect(
      updateShadowDesignTokensCollectionTokenValueReferences([FROM, FROM], update),
    ).toStrictEqual([TO, TO]);
  });
});
