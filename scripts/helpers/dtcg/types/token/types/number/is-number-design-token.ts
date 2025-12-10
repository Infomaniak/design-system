import type { UnknownDesignToken } from '../unknown/unknown-design-token.ts';
import type { NumberDesignToken } from './number-design-token.ts';

export function isNumberDesignToken(input: UnknownDesignToken): input is NumberDesignToken {
  return input.$type === 'number';
}
