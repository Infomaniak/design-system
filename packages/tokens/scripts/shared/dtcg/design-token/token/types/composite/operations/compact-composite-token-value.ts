import type { CurlyReference } from '../../../../reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../../../../reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../../../../reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import type { ValueOrCurlyReference } from '../../../../reference/types/curly/value-or/value-or-curly-reference.ts';
import type { SegmentsReference } from '../../../../reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../../../../reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import type { GenericDesignToken } from '../../../generic-design-token.ts';

/**
 * Check if a composite token's value contains only references with a common base.
 * If so, simplify and return a curly reference to the common base.
 */
export function compactCompositeTokenValue<GCompositeTokenValue extends object>(
  value: GCompositeTokenValue,
): GCompositeTokenValue | CurlyReference {
  const entries: [string, ValueOrCurlyReference<GenericDesignToken>][] = Object.entries(value);

  if (entries.length > 1) {
    const [firstEntryName, firstEntryValue] = entries[0];
    if (isCurlyReference(firstEntryValue)) {
      let commonBase: SegmentsReference = curlyReferenceToSegmentsReference(firstEntryValue);
      if (commonBase.at(-1) === firstEntryName) {
        commonBase = commonBase.slice(0, -1);

        for (let i: number = 1; i < entries.length; i++) {
          const [entryName, entryValue] = entries[i];

          if (isCurlyReference(entryValue)) {
            let entryReference: SegmentsReference = curlyReferenceToSegmentsReference(entryValue);

            if (entryReference.at(-1) === entryName) {
              entryReference = entryReference.slice(0, -1);
              if (JSON.stringify(commonBase) === JSON.stringify(entryReference)) {
                continue;
              }
            }
          }

          return value;
        }

        // here all members of value are curly references and the common base is the same
        return segmentsReferenceToCurlyReference(commonBase);
      }
    }
  }

  return value;
}
