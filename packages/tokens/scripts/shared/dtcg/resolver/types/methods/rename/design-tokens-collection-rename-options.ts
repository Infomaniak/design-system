import type { DesignTokensCollectionRenameExtensionsFunction } from './design-tokens-collection-rename-extensions-function.ts';

export interface DesignTokensCollectionRenameOptions {
  readonly extensions?: DesignTokensCollectionRenameExtensionsFunction;
  readonly onExitingTokenBehaviour?: 'throw' | 'replace' | 'skip' | 'only-references';
}
