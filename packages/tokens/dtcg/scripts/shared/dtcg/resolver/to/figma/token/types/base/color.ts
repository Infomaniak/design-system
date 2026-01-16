import Color, { type Coords } from 'colorjs.io';
import type { ColorDesignTokenValueComponent } from '../../../../../../design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';
import type { ColorDesignTokensCollectionToken } from '../../../../../token/types/base/color/color-design-tokens-collection-token.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../../../../../token/types/base/color/value/color-design-tokens-collection-token-value.ts';
import { valueOrCurlyReferenceToValueOrFigmaReference } from '../../../reference/value-or-curly-reference-to-figma-reference.ts';

export function colorDesignTokensCollectionTokenToFigmaObject(
  token: ColorDesignTokensCollectionToken,
): unknown {
  return {
    $type: 'color',
    $value: valueOrCurlyReferenceToValueOrFigmaReference(
      token.value,
      colorDesignTokensCollectionTokenValueToFigmaValue,
    ),
    $description: token.description,
  };
}

export function colorDesignTokensCollectionTokenValueToFigmaValue(
  value: ColorDesignTokensCollectionTokenValue,
): string {
  return new Color({
    space: value.colorSpace as any,
    coords: value.components.map((component: ColorDesignTokenValueComponent): number | null => {
      return component === 'none' ? null : (component as number);
    }) as Coords,
    alpha: value.alpha,
  }).toString({
    format: 'hex',
    collapse: false,
  });
}
