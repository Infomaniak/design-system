import type { DesignTokenReference } from './design-token-reference.ts';
import { isCurlyDesignTokenReference } from './types/curly/is-curly-design-token-reference.ts';

export function isDesignTokenReference(input: unknown): input is DesignTokenReference {
  return isCurlyDesignTokenReference(input);
}
