import { removeUndefinedProperties } from '../../../../../../../../../../scripts/helpers/misc/remove-undefined-properties.ts';
import { curlyReferenceSchema } from '../../../reference/types/curly/curly-reference.schema.ts';
import { curlyReferenceToSegmentsReference } from '../../../reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.js';
import { jsonReferenceSchema } from '../../../reference/types/json/json-reference.schema.ts';
import { jsonPointerToSegmentsReference } from '../../../reference/types/json/members/pointer/to/segments-reference/json-pointer-to-segments-reference.js';
import type { SegmentsReference } from '../../../reference/types/segments/segments-reference.js';
import { segmentsReferenceToCurlyReference } from '../../../reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.js';
import type { DesignTokensTree } from '../../../tree/design-tokens-tree.js';
import {
  DESIGN_TOKENS_TREE_EXTENDS_RESOLVING,
  normalizeExtendsOfDesignTokensTree,
  type NormalizeExtendsOfDesignTokensTreeContext,
} from '../../../tree/normalize/extends/normalize-extends-of-design-tokens-tree.js';
import type { NormalizeInheritedPropertiesOfDesignTokensTreeContext } from '../../../tree/normalize/inherited-properties/normalize-inherited-properties-of-design-tokens-tree.js';
import type { DesignTokensGroup } from '../../design-tokens-group.js';
import { isDesignTokensGroup } from '../../is-design-tokens-group.js';

import { patchDesignTokensGroup } from './patch-design-tokens-group.js';

export function normalizeExtendsOfDesignTokensGroup(
  input: DesignTokensGroup,
  ctx: NormalizeExtendsOfDesignTokensTreeContext,
): DesignTokensTree {
  const cached: DesignTokensTree | typeof DESIGN_TOKENS_TREE_EXTENDS_RESOLVING | undefined =
    ctx.cache.get(input);

  if (cached === DESIGN_TOKENS_TREE_EXTENDS_RESOLVING) {
    throw new Error('Circular reference detected.');
  } else if (cached !== undefined) {
    return cached;
  }

  const { $description, $type, $extends, $ref, $deprecated, $extensions, ...children } = input;

  let reference: SegmentsReference | undefined;

  if ($extends !== undefined && $ref !== undefined) {
    throw new Error('Cannot have simultaneously $extends and $ref.');
  }

  if ($extends !== undefined) {
    if (!curlyReferenceSchema.safeParse($extends).success) {
      throw new Error('$extends is not a curly reference.');
    }

    reference = curlyReferenceToSegmentsReference($extends);
  } else if ($ref !== undefined) {
    if (!jsonReferenceSchema.safeParse($extends).success) {
      throw new Error('$ref is not a json reference.');
    }

    reference = jsonPointerToSegmentsReference($ref);
  }

  let output: DesignTokensTree = {
    ...removeUndefinedProperties({
      $description,
      $type,
      $deprecated,
      $extensions,
    }),
    ...Object.fromEntries(
      Object.entries(children).map(
        ([name, child]: [string, DesignTokensTree]): [string, DesignTokensTree] => {
          return [name, normalizeExtendsOfDesignTokensTree(child, ctx)];
        },
      ),
    ),
  };

  ctx.cache.set(input, DESIGN_TOKENS_TREE_EXTENDS_RESOLVING);

  if (reference !== undefined) {
    let node: any = ctx.root;
    let inherited: NormalizeInheritedPropertiesOfDesignTokensTreeContext =
      removeUndefinedProperties({
        $description: node.$description,
        $type: node.$type,
        $deprecated: node.$deprecated,
        $extensions: node.$extensions,
      });

    for (let i: number = 0; i < reference.length; i++) {
      const segment: string = reference[i];
      const isLast: boolean = i === reference.length - 1;

      if (!Reflect.has(node, reference[i])) {
        throw new Error(`Unresolvable reference: ${reference.slice(0, i).join('.')}`);
      }

      node = Reflect.get(node, segment);

      if (!isDesignTokensGroup(node)) {
        if (isLast) {
          return {
            $value: segmentsReferenceToCurlyReference(reference),
          };
        }
        throw new Error('Not a DesignTokensGroup.');
      }

      if (Reflect.has(node, '$extends') || Reflect.has(node, '$ref') || isLast) {
        node = normalizeExtendsOfDesignTokensGroup(node, ctx);
      }

      inherited = {
        ...inherited,
        ...removeUndefinedProperties({
          $description: node.$description,
          $type: node.$type,
          $deprecated: node.$deprecated,
          $extensions: node.$extensions,
        }),
      };

      node = {
        ...inherited,
        ...node,
      };
    }

    output = patchDesignTokensGroup(output, node);
  }

  ctx.cache.set(input, output);

  return output;
}
