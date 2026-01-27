import type { UpdateCurlyReference } from '../../../../design-token/reference/types/curly/update/update-curly-reference.ts';
import { updateCurlyReferencesRecursively } from '../../../../design-token/reference/types/curly/update/update-curly-references-recursively.ts';
import type { DesignTokensCollectionTokenExtensions } from '../../../token/design-tokens-collection-token.ts';

export interface DesignTokensCollectionRenameExtensionsFunction {
  (
    extensions: DesignTokensCollectionTokenExtensions,
    update: UpdateCurlyReference,
  ): DesignTokensCollectionTokenExtensions;
}

/*--*/

export function designTokensCollectionRenameExtensionsAutomatically(
  extensions: DesignTokensCollectionTokenExtensions,
  update: UpdateCurlyReference,
): DesignTokensCollectionTokenExtensions {
  return updateCurlyReferencesRecursively(extensions, update);
}
