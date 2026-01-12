import type { DesignTokensGroup } from '../group/design-tokens-group.ts';
import type { DesignToken } from '../token/design-token.js';

export type DesignTokensTree = DesignToken<any, any> | DesignTokensGroup;
