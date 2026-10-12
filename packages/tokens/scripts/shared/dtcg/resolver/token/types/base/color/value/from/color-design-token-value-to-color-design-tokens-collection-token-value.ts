import type { CurlyReference } from '../../../../../../../design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../../../../../../../design-token/reference/types/curly/is-curly-reference.ts';
import { resolveValueOrJsonReference } from '../../../../../../../design-token/reference/types/json/value-or/resolve/resolve-value-or-json-reference.ts';
import type { ValueOrJsonReference } from '../../../../../../../design-token/reference/types/json/value-or/value-or-json-reference.ts';
import type { ColorDesignTokenValue } from '../../../../../../../design-token/token/types/base/types/color/value/color-design-token-value.ts';
import type { ColorDesignTokenValueComponents } from '../../../../../../../design-token/token/types/base/types/color/value/members/components/color-design-token-value-components.ts';
import type { ColorDesignTokenValueComponent } from '../../../../../../../design-token/token/types/base/types/color/value/members/components/component/color-design-token-value-component.ts';
import type { ColorDesignTokensCollectionTokenValue } from '../color-design-tokens-collection-token-value.ts';

export function colorDesignTokenValueToColorDesignTokensCollectionTokenValue(
  $value: ColorDesignTokenValue,
  root: unknown,
): ColorDesignTokensCollectionTokenValue {
  /**
   * NOTE: Curly reference is not official
   */
  const components: ColorDesignTokenValueComponents | CurlyReference = resolveValueOrJsonReference(
    $value.components,
    root,
  );

  return {
    colorSpace: resolveValueOrJsonReference($value.colorSpace, root),
    components: isCurlyReference(components)
      ? components
      : components.map(
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
