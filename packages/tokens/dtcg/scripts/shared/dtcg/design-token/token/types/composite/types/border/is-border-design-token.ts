import type { GenericDesignToken } from '../../../../generic-design-token.js';
import type { BorderDesignToken } from './border-design-token.ts';

export function isBorderDesignToken(input: GenericDesignToken): input is BorderDesignToken {
  return input.$type === 'border';
}
