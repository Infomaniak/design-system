import type { GenericDesignToken } from '../../../../generic-design-token.js';
import type { TypographyDesignToken } from './typography-design-token.ts';

export function isTypographyDesignToken(input: GenericDesignToken): input is TypographyDesignToken {
  return input.$type === 'typography';
}
