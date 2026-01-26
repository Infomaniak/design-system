import type { GenericDesignToken } from '../../../../generic-design-token.ts';
import type { NumberDesignToken } from './number-design-token.ts';

export function isNumberDesignToken(input: GenericDesignToken): input is NumberDesignToken {
  return input.$type === 'number';
}
