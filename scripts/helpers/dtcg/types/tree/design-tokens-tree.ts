import type { DesignTokensGroup } from '../group/design-tokens-group.ts';

import type { UnknownDesignToken } from '../token/types/unknown/unknown-design-token.ts';

export type DesignTokensTree = UnknownDesignToken | DesignTokensGroup;
