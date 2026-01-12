import type { DesignTokensTree } from '../tree/design-tokens-tree.ts';

import type { GenericDesignToken } from './generic-design-token.js';

export function isDesignToken(input: DesignTokensTree): input is GenericDesignToken {
  return Reflect.has(input, '$value');
}
