import type { DesignTokenNameSegment } from '../../../dtcg/design-token/token/name/segment/design-token-name-segment.ts';

import type { TokensBrueckeDesignTokensTree } from '../tree/tokens-bruecke-design-tokens-tree.ts';

export interface TokensBrueckeDesignTokensGroup {
  readonly $description?: string;
  readonly $extensions?: Record<string, unknown>;
  readonly $deprecated?: string | boolean;
  readonly [key: DesignTokenNameSegment]: TokensBrueckeDesignTokensTree;
}
