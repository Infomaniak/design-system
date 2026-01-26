import type { DesignTokensGroup } from '../group/design-tokens-group.ts';
import type { GenericDesignToken } from '../token/generic-design-token.ts';

export type DesignTokensTree = GenericDesignToken | DesignTokensGroup;
