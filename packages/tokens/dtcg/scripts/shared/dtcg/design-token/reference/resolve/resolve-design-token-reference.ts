import type { DesignTokenReference } from '../design-token-reference.js';
import { curlyReferenceSchema } from '../types/curly/curly-reference.schema.ts';
import type { CurlyReference } from '../types/curly/curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../types/curly/to/segments-reference/curly-reference-to-segments-reference.js';
import { jsonReferenceSchema } from '../types/json/json-reference.schema.ts';
import type { JsonReference } from '../types/json/json-reference.ts';
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

  let reference: SegmentsReference = curlyReferenceSchema.safeParse(designTokenReference).success
    ? [...curlyReferenceToSegmentsReference(designTokenReference as CurlyReference), '$value']
    : jsonReferenceToSegmentsReference(designTokenReference as JsonReference);

  while (true) {
    references.push(reference);
    let value: unknown = resolveSegmentsReference(reference, root);

    if (recursive && curlyReferenceSchema.safeParse(value).success) {
      if (explored.has(value as CurlyReference)) {
        throw new Error(
          `Unable to resolve reference "${segmentsReferenceToCurlyReference(reference)}" because of circular reference.`,
        );
      }
      explored.add(value as CurlyReference);
      reference = [...curlyReferenceToSegmentsReference(value as CurlyReference), '$value'];
    } else if (recursive && jsonReferenceSchema.safeParse(value).success) {
      if (explored.has((value as JsonReference).$ref)) {
        throw new Error(
          `Unable to resolve reference "${segmentsReferenceToJsonPointer(reference)}" because of circular reference.`,
        );
      }
      explored.add((value as JsonReference).$ref);
      reference = jsonReferenceToSegmentsReference(value as JsonReference);
    } else {
      return {
        value,
        references,
      };
    }
  }
}
