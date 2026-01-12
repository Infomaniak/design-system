import { removeUndefinedProperties } from '../../../../../../../../../../scripts/helpers/misc/remove-undefined-properties.ts';
import { isDesignToken } from '../../../token/is-design-token.js';
import type { DesignTokensTree } from '../../../tree/design-tokens-tree.js';
import type { DesignTokensGroup } from '../../design-tokens-group.js';

export function patchDesignTokensGroup(
  source: DesignTokensGroup,
  patch: DesignTokensGroup,
): DesignTokensGroup {
  const { $description, $type, $extends, $ref, $deprecated, $extensions, ...children } = source;

  if ($extends !== undefined || $ref !== undefined) {
    throw new Error('Source should not have $extends.');
  }

  if (patch.$extends !== undefined || patch.$ref !== undefined) {
    throw new Error('Patch should not have $extends.');
  }

  return {
    ...patch,
    ...removeUndefinedProperties({
      $description,
      $type,
      $deprecated,
      $extensions,
    }),
    ...Object.fromEntries(
      Object.entries(children).map(
        ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
          if (!Reflect.has(patch, name) || isDesignToken(child)) {
            return [name, child];
          } else {
            return [name, patchDesignTokensGroup(child, Reflect.get(patch, name))];
          }
        },
      ),
    ),
  };
}
