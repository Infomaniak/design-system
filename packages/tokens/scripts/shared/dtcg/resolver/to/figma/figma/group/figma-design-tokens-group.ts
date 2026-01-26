import type { DesignTokenNameSegment } from '../../../../../design-token/token/name/segment/design-token-name-segment.ts';
import type { FigmaDesignTokensTree } from '../tree/figma-design-tokens-tree.ts';

export interface FigmaDesignTokensGroup {
  readonly [name: DesignTokenNameSegment]: FigmaDesignTokensTree;
}
