import type { EqualFunction } from './equal-function.ts';
import { isStrictEqual } from './is-strict-equal.ts';

export const STRICT_EQUALS: EqualFunction = isStrictEqual;
