import { resolveSegmentsReference } from '../../segments/resolve/resolve-segments-reference.js';
import type { SegmentsReference } from '../../segments/segments-reference.js';
import { segmentsReferenceToJsonPointer } from '../../segments/to/json-reference/json-pointer/segments-reference-to-json-pointer.js';
import type { JsonReference } from '../json-reference.js';
import { jsonReferenceSchema } from '../json-reference.schema.ts';
import { jsonReferenceToSegmentsReference } from '../to/segments-reference/json-reference-to-segments-reference.js';

export interface ResolvedJsonReference {
  readonly value: unknown;
  readonly references: readonly SegmentsReference[];
}

export function resolveJsonReference(
  jsonReference: JsonReference,
  root: unknown,
  recursive: boolean = true,
): ResolvedJsonReference {
  const explored: Set<string> = new Set<string>();
  const references: SegmentsReference[] = [];
  let reference: SegmentsReference = jsonReferenceToSegmentsReference(jsonReference);

  while (true) {
    references.push(reference);
    let value: unknown = resolveSegmentsReference(reference, root);

    if (recursive && jsonReferenceSchema.safeParse(value).success) {
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
