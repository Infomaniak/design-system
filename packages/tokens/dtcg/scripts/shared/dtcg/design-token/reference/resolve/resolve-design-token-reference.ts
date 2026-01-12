import type { DesignTokenReference } from '../design-token-reference.js';
import { isCurlyReference } from '../types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../types/curly/to/segments-reference/curly-reference-to-segments-reference.js';
import { isJsonReference } from '../types/json/is-json-reference.ts';
import { jsonReferenceToSegmentsReference } from '../types/json/to/segments-reference/json-reference-to-segments-reference.js';
import { resolveSegmentsReference } from '../types/segments/resolve/resolve-segments-reference.js';
import type { SegmentsReference } from '../types/segments/segments-reference.js';
import { segmentsReferenceToCurlyReference } from '../types/segments/to/curly-reference/segments-reference-to-curly-reference.js';
import { segmentsReferenceToJsonPointer } from '../types/segments/to/json-reference/json-pointer/segments-reference-to-json-pointer.js';

export interface ResolvedDesignTokenReference {
  readonly value: unknown;
  readonly references: readonly SegmentsReference[];
}

export function resolveDesignTokenReference(
  designTokenReference: DesignTokenReference,
  root: unknown,
  recursive: boolean = true,
): ResolvedDesignTokenReference {
  const explored: Set<string> = new Set<string>();
  const references: SegmentsReference[] = [];

  let reference: SegmentsReference = isCurlyReference(designTokenReference)
    ? [...curlyReferenceToSegmentsReference(designTokenReference), '$value']
    : jsonReferenceToSegmentsReference(designTokenReference);

  while (true) {
    references.push(reference);
    let value: unknown = resolveSegmentsReference(reference, root);

    if (recursive && isCurlyReference(value)) {
      if (explored.has(value)) {
        throw new Error(
          `Unable to resolve reference "${segmentsReferenceToCurlyReference(reference)}" because of circular reference.`,
        );
      }
      explored.add(value);
      reference = [...curlyReferenceToSegmentsReference(value), '$value'];
    } else if (recursive && isJsonReference(value)) {
      if (explored.has(value.$ref)) {
        throw new Error(
          `Unable to resolve reference "${segmentsReferenceToJsonPointer(reference)}" because of circular reference.`,
        );
      }
      explored.add(value.$ref);
      reference = jsonReferenceToSegmentsReference(value);
    } else {
      return {
        value,
        references,
      };
    }
  }
}
