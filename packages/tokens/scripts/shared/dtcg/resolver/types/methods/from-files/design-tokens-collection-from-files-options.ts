import type { DesignTokensCollectionFromDesignTokensTreeOptions } from '../from-design-tokens-tree/design-tokens-collection-from-design-tokens-tree-options.ts';

export type DesignTokensCollectionFromFilesOptions = Omit<
  DesignTokensCollectionFromDesignTokensTreeOptions,
  'files'
>;
