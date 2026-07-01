import { capitalizeFirstLetter } from '../../../../../../../../../scripts/helpers/misc/case/capitalize-first-letter/capitalize-first-letter.ts';
import { segmentsToSwiftIdentifier } from '../../../../../../shared/dtcg/resolver/to/swift/token/name/design-token-name-segments-reference-to-swift-name.ts';
import type { GenericDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';

export function getSwiftTokenGroupName(token: GenericDesignTokensCollectionToken): string {
  return capitalizeFirstLetter(token.name[0]);
}

export function tokenToSwiftValue(prefix: string, token: GenericDesignTokensCollectionToken) {
  const groupName = getSwiftTokenGroupName(token);
  const tokenName = segmentsToSwiftIdentifier(token.name, 1);

  return `${prefix}.${groupName}.${tokenName}`;
}
