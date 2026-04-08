import type { UpdateCurlyReference } from '../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { updateCurlyReferencesRecursively } from '../../../../design-token/reference/types/curly/update/update-curly-references-recursively.ts';
import type { DesignTokensCollectionTokenExtensions } from '../../../token/design-tokens-collection-token.ts';

export interface DesignTokensCollectionRenameExtensionsFunction {
  (
    extensions: DesignTokensCollectionTokenExtensions,
    update: UpdateCurlyReference,
  ): DesignTokensCollectionTokenExtensions;
}

/* BUILT-IN FUNCTIONS */

/**
 * Renames `extensions` of a design token by recursively updating all references present in the object.
 */
export function designTokensCollectionRenameExtensionsAutomatically(
  extensions: DesignTokensCollectionTokenExtensions,
  update: UpdateCurlyReference,
): DesignTokensCollectionTokenExtensions {
  return updateCurlyReferencesRecursively(extensions, update);
}

/**
 * Skips renaming of `extensions` references of a design token.
 */
export const DO_NOT_RENAME_DESIGN_TOKENS_COLLECTION_EXTENSIONS: DesignTokensCollectionRenameExtensionsFunction =
  (
    extensions: DesignTokensCollectionTokenExtensions,
    _update: UpdateCurlyReference,
  ): DesignTokensCollectionTokenExtensions => {
    return extensions;
  };
