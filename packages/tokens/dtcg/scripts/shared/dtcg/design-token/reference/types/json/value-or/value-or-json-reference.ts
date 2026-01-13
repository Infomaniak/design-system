import type { JsonReference } from '../json-reference.ts';

export type ValueOrJsonReference<GValue> = GValue | JsonReference;
