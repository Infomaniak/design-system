import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/object/remove-undefined-properties.ts';
import type { DesignTokensGroup } from '../../../design-token/group/design-tokens-group.ts';
import { isDesignToken } from '../../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../../design-token/tree/design-tokens-tree.ts';

export type CascadeInheritedPropertiesOfDesignTokensTreeOn = 'origin' | 'group' | 'token';

export interface CascadeInheritedPropertiesOfDesignTokensTreeContext {
  readonly $description?: string;
  readonly $type?: string;
  readonly $deprecated?: boolean | string;
  readonly $extensions?: object;
}

const DEFAULT_CASCADE_ON: ReadonlySet<CascadeInheritedPropertiesOfDesignTokensTreeOn> =
  new Set<CascadeInheritedPropertiesOfDesignTokensTreeOn>(['origin', 'group', 'token']);

export function cascadeInheritedPropertiesOfDesignTokensTree(
  input: DesignTokensTree,
  cascadeOn: Iterable<CascadeInheritedPropertiesOfDesignTokensTreeOn> = DEFAULT_CASCADE_ON,
  ctx: CascadeInheritedPropertiesOfDesignTokensTreeContext = {},
): DesignTokensTree {
  const cascadeOnSet: ReadonlySet<CascadeInheritedPropertiesOfDesignTokensTreeOn> =
    cascadeOn instanceof Set
      ? cascadeOn
      : new Set<CascadeInheritedPropertiesOfDesignTokensTreeOn>(cascadeOn);

  if (cascadeOnSet.size === 0 || (cascadeOnSet.size === 1 && cascadeOnSet.has('origin'))) {
    // nothing to cascade, return the original tree
    return input;
  }

  if (isDesignToken(input)) {
    if (cascadeOnSet.has('token')) {
      return {
        ...ctx,
        ...input,
      };
    } else {
      return input;
    }
  } else {
    const {
      $description,
      $type,
      $extends,
      $ref,
      $deprecated,
      $extensions,
      ...children
    }: DesignTokensGroup = input;

    const subCtx: CascadeInheritedPropertiesOfDesignTokensTreeContext = {
      ...ctx,
      ...removeUndefinedProperties({
        $description,
        $type,
        $deprecated,
        $extensions,
      }),
    };

    return {
      ...removeUndefinedProperties({
        ...(cascadeOnSet.has('group')
          ? subCtx
          : cascadeOnSet.has('origin')
            ? {
                $description,
                $type,
                $deprecated,
                $extensions,
              }
            : {}),
        $extends,
        $ref,
      }),
      ...Object.fromEntries(
        Object.entries(children).map(
          ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
            return [name, cascadeInheritedPropertiesOfDesignTokensTree(child, cascadeOn, subCtx)];
          },
        ),
      ),
    };
  }
}
