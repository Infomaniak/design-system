import type { SegmentsReference } from '../segments-reference.ts';

export function resolveSegmentsReference(reference: SegmentsReference, root: unknown): unknown {
  let value: unknown = root;

  for (let i: number = 0; i < reference.length; i++) {
    const segment: string = reference[i];

    if (typeof value !== 'object' || value === null) {
      throw new Error(
        `Unable to resolve reference "${reference.slice(0, i).join('.')}": not an object.`,
      );
    }

    if (!Reflect.has(value, segment)) {
      throw new Error(
        `Unable to resolve reference "${reference.slice(0, i).join('.')}": missing property "${segment}".`,
      );
    }

    value = Reflect.get(value, segment);
  }

  return value;
}
