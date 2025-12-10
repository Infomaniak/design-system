import type { UnknownDesignToken } from '../../unknown/unknown-design-token.ts';
import type { TypographyDesignToken } from './typography-design-token.ts';

export function isTypographyDesignToken(input: UnknownDesignToken): input is TypographyDesignToken {
  return input.$type === 'typography';
}
