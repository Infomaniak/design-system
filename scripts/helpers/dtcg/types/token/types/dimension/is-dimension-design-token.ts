import type { UnknownDesignToken } from '../unknown/unknown-design-token.ts';
import type { DimensionDesignToken } from './dimension-design-token.ts';

export function isDimensionDesignToken(input: UnknownDesignToken): input is DimensionDesignToken {
  return input.$type === 'dimension';
}
