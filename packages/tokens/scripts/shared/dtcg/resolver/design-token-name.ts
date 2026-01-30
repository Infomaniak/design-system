import type { CurlyReference } from '../design-token/reference/types/curly/curly-reference.ts';
import { isCurlyReference } from '../design-token/reference/types/curly/is-curly-reference.ts';
import { curlyReferenceToSegmentsReference } from '../design-token/reference/types/curly/to/segments-reference/curly-reference-to-segments-reference.ts';
import { isJsonReference } from '../design-token/reference/types/json/is-json-reference.ts';
import type { JsonReference } from '../design-token/reference/types/json/json-reference.ts';
import { isJsonPointer } from '../design-token/reference/types/json/members/pointer/is-json-pointer.ts';
import type { JsonPointer } from '../design-token/reference/types/json/members/pointer/json-pointer.ts';
import { jsonPointerToSegmentsReference } from '../design-token/reference/types/json/members/pointer/to/segments-reference/json-pointer-to-segments-reference.ts';
import { jsonReferenceToSegmentsReference } from '../design-token/reference/types/json/to/segments-reference/json-reference-to-segments-reference.ts';
import { isSegmentsReference } from '../design-token/reference/types/segments/is-segments-reference.ts';
import type { SegmentsReference } from '../design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import { segmentsReferenceToJsonPointer } from '../design-token/reference/types/segments/to/json-reference/json-pointer/segments-reference-to-json-pointer.ts';
import { segmentsReferenceToJsonReference } from '../design-token/reference/types/segments/to/json-reference/segments-reference-to-json-reference.ts';

export class DesignTokenName {
  readonly #segments: SegmentsReference;

  constructor(input: SegmentsReference | CurlyReference | JsonReference | JsonPointer | string) {
    if (isSegmentsReference(input)) {
      this.#segments = input;
    } else if (isCurlyReference(input)) {
      this.#segments = curlyReferenceToSegmentsReference(input);
    } else if (isJsonReference(input)) {
      this.#segments = jsonReferenceToSegmentsReference(input);
    } else if (isJsonPointer(input)) {
      this.#segments = jsonPointerToSegmentsReference(input);
    } else {
      this.#segments = (input as string).split('.');
    }
  }

  get segments(): SegmentsReference {
    return this.#segments;
  }

  toCurlyReference(): CurlyReference {
    return segmentsReferenceToCurlyReference(this.#segments);
  }

  toJsonReference(): JsonReference {
    return segmentsReferenceToJsonReference(this.#segments);
  }

  toJsonPointer(): JsonPointer {
    return segmentsReferenceToJsonPointer(this.#segments);
  }

  toString(): string {
    return this.#segments.join('.');
  }

  toStringKey(): string {
    return JSON.stringify(this.#segments);
  }
}
