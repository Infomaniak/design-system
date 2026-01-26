import { removeUndefinedProperties } from '../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../design-token/group/design-tokens-group.ts';
import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';

export function extendDesignTokensGroup(
  source: DesignTokensGroup,
  extendedBy: DesignTokensGroup,
): DesignTokensGroup {
  const { $description, $type, $extends, $ref, $deprecated, $extensions, ...children } = source;

  if ($extends !== undefined || $ref !== undefined) {
    throw new Error('Source should not have $extends.');
  }

  if (extendedBy.$extends !== undefined || extendedBy.$ref !== undefined) {
    throw new Error('Patch should not have $extends.');
  }

  return {
    ...extendedBy,
    ...removeUndefinedProperties({
      $description,
      $type,
      $deprecated,
      $extensions,
    }),
    ...Object.fromEntries(
      Object.entries(children).map(
        ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
          if (!Reflect.has(extendedBy, name) || isDesignToken(child)) {
            return [name, child];
          } else {
            return [name, extendDesignTokensGroup(child, Reflect.get(extendedBy, name))];
          }
        },
      ),
    ),
  };
}
