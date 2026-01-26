import type { DesignTokensTree } from '../tree/design-tokens-tree.ts';
import type { DesignTokensGroup } from './design-tokens-group.ts';

export function isDesignTokensGroup(input: DesignTokensTree): input is DesignTokensGroup {
  return !Reflect.has(input, '$value');
}
