import type { SegmentsReference } from '../segments-reference.ts';

export function hasExistingSegmentsReference(reference: SegmentsReference, root: unknown): boolean {
  let value: unknown = root;

  for (let i: number = 0; i < reference.length; i++) {
    const segment: string = reference[i];

    if (typeof value !== 'object' || value === null || !Reflect.has(value, segment)) {
      return false;
    }

    value = Reflect.get(value, segment);
  }

  return true;
}
