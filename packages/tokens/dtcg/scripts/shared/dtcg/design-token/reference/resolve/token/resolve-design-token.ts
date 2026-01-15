import { removeUndefinedProperties } from '../../../../../../../../../../scripts/helpers/misc/remove-undefined-properties.ts';
import type { DesignToken } from '../../../token/design-token.ts';
import type { DesignTokensTree } from '../../../tree/design-tokens-tree.ts';
import { isDesignTokenReference } from '../../is-design-token-reference.ts';
import { resolveDesignTokenReference } from '../resolve-design-token-reference.ts';
import type { ResolvedDesignToken } from './resolved-design-token.ts';

export function resolveDesignToken<GType extends string, GValue>(
  { $value, $description, $type, $deprecated, $extensions }: DesignToken<GType, GValue>,
  root: DesignTokensTree,
): ResolvedDesignToken<GType, GValue> {
  if (isDesignTokenReference($value)) {
    const { token } = resolveDesignTokenReference($value, root);

    $type ??= token.$type;

    if ($type === undefined) {
      throw new Error('Unable to resolve $type.');
    }

    return {
      ...token,
      ...removeUndefinedProperties({
        $description,
        $deprecated,
        $extensions,
      }),
      $type,
      $value: token.$value,
    };
  } else {
    if ($type === undefined) {
      throw new Error('Design token without type is not supported.');
    }

    return {
      ...removeUndefinedProperties({
        $description,
        $deprecated,
        $extensions,
      }),
      $type,
      $value,
    };
  }
}
