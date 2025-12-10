import type { DesignTokensTree } from '../tree/design-tokens-tree.ts';
import type { UnknownDesignToken } from './types/unknown/unknown-design-token.ts';

export function isDesignToken(input: DesignTokensTree): input is UnknownDesignToken {
  return !Reflect.has(input, '$value');
}
