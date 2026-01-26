import type { GenericDesignToken } from '../../../../generic-design-token.ts';
import type { DimensionDesignToken } from './dimension-design-token.ts';

export function isDimensionDesignToken(input: GenericDesignToken): input is DimensionDesignToken {
  return input.$type === 'dimension';
}
