import type { UnknownDesignToken } from '../../unknown/unknown-design-token.ts';
import type { BorderDesignToken } from './border-design-token.ts';

export function isBorderDesignToken(input: UnknownDesignToken): input is BorderDesignToken {
  return input.$type === 'border';
}
