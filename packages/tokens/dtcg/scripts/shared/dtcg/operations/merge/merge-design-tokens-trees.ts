import { removeUndefinedProperties } from '../../../../../../../../scripts/helpers/misc/remove-undefined-properties.ts';
import type { SegmentsReference } from '../../design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import { isDesignToken } from '../../design-token/token/is-design-token.ts';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';

export interface MergeDesignTokensGroupsOptions {
  readonly preventTokenCollision?: boolean;
  readonly path?: SegmentsReference;
}

export function mergeDesignTokensTrees(
  treeA: DesignTokensTree,
  treeB: DesignTokensTree,
  { preventTokenCollision = true, path = [] }: MergeDesignTokensGroupsOptions = {},
): DesignTokensTree {
  if (isDesignToken(treeA)) {
    if (!isDesignToken(treeB)) {
      throw new Error('Got a DesignToken as input A, and a DesignTokensGroup as input B.');
    }

    if (preventTokenCollision) {
      throw new Error(
        `Tokens at ${segmentsReferenceToCurlyReference(path)} collide with each other.`,
      );
    }

    return {
      ...treeA,
      ...treeB,
    };
  } else {
    if (isDesignToken(treeB)) {
      throw new Error('Got a DesignTokensGroup as input A, and a DesignToken as input B.');
    }
  }

  const {
    $description: $descriptionB,
    $type: $typeB,
    $extends: $extendsB,
    $ref: $refB,
    $deprecated: $deprecatedB,
    $extensions: $extensionsB,
    ...childrenB
  } = treeB;

  if (treeA.$extends !== undefined || treeA.$ref !== undefined) {
    throw new Error('Input A should not have $extends.');
  }

  if ($extendsB !== undefined || $refB !== undefined) {
    throw new Error('Input B should not have $extends.');
  }

  return {
    ...treeA,
    ...removeUndefinedProperties({
      $description: $descriptionB,
      $typeA: $typeB,
      $deprecatedA: $deprecatedB,
      $extensionsB,
    }),
    ...Object.fromEntries(
      Object.entries(childrenB).map(
        ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
          if (Reflect.has(treeA, name)) {
            return [
              name,
              mergeDesignTokensTrees(Reflect.get(treeA, name), child, {
                preventTokenCollision,
                path: [...path, name],
              }),
            ];
          } else {
            return [name, child];
          }
        },
      ),
    ),
  };
}
