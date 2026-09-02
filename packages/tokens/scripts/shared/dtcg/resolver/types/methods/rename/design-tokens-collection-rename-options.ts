import type { GenericDesignTokensCollectionToken } from '../../../token/design-tokens-collection-token.ts';
import type { DesignTokensCollectionRenameExtensionsFunction } from './design-tokens-collection-rename-extensions-function.ts';

export interface DesignTokensCollectionRenameOptions {
  readonly extensions?: DesignTokensCollectionRenameExtensionsFunction;
  readonly onExistingTokenBehaviour?: 'throw' | 'replace' | 'skip' | 'only-references';
  readonly filter?: DesignTokensCollectionRenameFilterFunction;
}

export interface DesignTokensCollectionRenameFilterFunction {
  (token: GenericDesignTokensCollectionToken): boolean;
}
