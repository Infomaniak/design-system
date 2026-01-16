import { resolveValueOrJsonReference } from '../../../../../../../design-token/reference/types/json/value-or/resolve/resolve-value-or-json-reference.ts';
import type { ValueOrJsonReference } from '../../../../../../../design-token/reference/types/json/value-or/value-or-json-reference.ts';
import type { ColorDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/color/value/color-design-token-value.ts';
import type { ColorDesignTokenValueComponent } from '../../../../../../../design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../color-design-tokens-collection-token-value.ts';

export function colorDesignTokenValueToColorDesignTokensCollectionTokenValue(
  $value: ColorDesignTokenValue,
  root: unknown,
): ColorDesignTokensCollectionTokenValue {
  return {
    colorSpace: resolveValueOrJsonReference($value.colorSpace, root),
    components: resolveValueOrJsonReference($value.components, root).map(
      (
        component: ValueOrJsonReference<ColorDesignTokenValueComponent>,
      ): ColorDesignTokenValueComponent => {
        return resolveValueOrJsonReference(component, root);
      },
    ),
    alpha: resolveValueOrJsonReference($value.alpha, root),
    hex: resolveValueOrJsonReference($value.hex, root),
  };
}
