import type { FigmaDesignTokensGroup } from '../group/figma-design-tokens-group.ts';
import type { GenericFigmaDesignToken } from '../token/generic-figma-design-token.ts';

export type FigmaDesignTokensTree = GenericFigmaDesignToken | FigmaDesignTokensGroup;
