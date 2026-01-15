import type { SegmentsReference } from './segments-reference.ts';

export function isSegmentsReference(input: unknown): input is SegmentsReference {
  return (
    Array.isArray(input) &&
    input.every((segment: unknown): segment is string => typeof segment === 'string')
  );
}
