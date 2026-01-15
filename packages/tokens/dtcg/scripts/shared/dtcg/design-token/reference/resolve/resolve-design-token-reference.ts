import { isObject } from 'is-what';
import { removeUndefinedProperties } from '../../../../../../../../../scripts/helpers/misc/remove-undefined-properties.ts';
import { isDesignTokensGroup } from '../../group/is-design-tokens-group.ts';
import type { GenericDesignToken } from '../../token/generic-design-token.ts';
import { isDesignToken } from '../../token/is-design-token.ts';
import type { DesignTokensTree } from '../../tree/design-tokens-tree.ts';
import type { DesignTokenReference } from '../design-token-reference.ts';
import { isDesignTokenReference } from '../is-design-token-reference.ts';
import { designTokenReferenceToSegmentsReference } from '../to/segments-reference/design-token-reference-to-segments-reference.ts';
import { isJsonReference } from '../types/json/is-json-reference.ts';
import { jsonReferenceToSegmentsReference } from '../types/json/to/segments-reference/json-reference-to-segments-reference.ts';
import type { SegmentsReference } from '../types/segments/segments-reference.ts';
import { segmentsReferenceToString } from '../types/segments/to/string/segments-reference-to-string.ts';
import type { ResolvedGenericDesignToken } from './token/resolved-generic-design-token.ts';

export interface ResolvedDesignTokenReference {
  readonly token: ResolvedGenericDesignToken;
  readonly references: readonly SegmentsReference[];
}

export function resolveDesignTokenReference(
  designTokenReference: DesignTokenReference,
  root: DesignTokensTree,
): ResolvedDesignTokenReference {
  const explored: Map<string, SegmentsReference> = new Map<string, SegmentsReference>();

  let reference: SegmentsReference = designTokenReferenceToSegmentsReference(designTokenReference);

  let inherited: Pick<
    GenericDesignToken,
    '$description' | '$type' | '$deprecated' | '$extensions'
  > = {};

  while (true) {
    const stringReference: string = segmentsReferenceToString(reference);
    if (explored.has(stringReference)) {
      throw new Error(
        `While resolving ${stringReference}, circular reference detected. References: ${Array.from(explored.keys()).join(', ')}.`,
      );
    }
    explored.set(stringReference, reference);

    let node: DesignTokensTree = root;

    for (let i: number = 0; i < reference.length; i++) {
      const segment: string = reference[i];

      if (!isDesignTokensGroup(node)) {
        throw new Error(
          `While resolving ${segmentsReferenceToString(reference.slice(0, i))}, expected DesignTokensGroup.`,
        );
      }

      const { $description, $type, $extends, $ref, $deprecated, $extensions, ...children } = node;

      if ($extends !== undefined || $ref !== undefined) {
        throw new Error('Tree should not have $extends.');
      }

      inherited = {
        ...inherited,
        ...removeUndefinedProperties({
          $description,
          $type,
          $deprecated,
          $extensions,
        }),
      };

      node = Reflect.get(children, segment);

      if (!isObject(node)) {
        throw new Error(
          `While resolving ${segmentsReferenceToString(reference.slice(0, i + 1))}, expected object.`,
        );
      }
    }

    if (isJsonReference(node)) {
      reference = jsonReferenceToSegmentsReference(node);
      continue;
    }

    if (!isDesignToken(node)) {
      throw new Error(`While resolving ${stringReference}, expected DesignToken.`);
    }

    const { $value, $description, $type, $deprecated, $extensions } = node;

    inherited = {
      ...inherited,
      ...removeUndefinedProperties({
        $description,
        $type,
        $deprecated,
        $extensions,
      }),
    };

    if (isDesignTokenReference($value)) {
      reference = designTokenReferenceToSegmentsReference($value);
      continue;
    }

    if (inherited.$type === undefined) {
      throw new Error('Unable to resolve $type.');
    }

    return {
      token: {
        ...inherited,
        $value,
      } as ResolvedGenericDesignToken,
      references: Array.from(explored.values()),
    };
  }
}
