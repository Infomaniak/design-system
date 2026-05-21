import { segmentsToSwiftIdentifier } from "../../../../../../shared/dtcg/resolver/to/swift/token/name/design-token-name-segments-reference-to-swift-name.ts";
import type { GenericDesignTokensCollectionToken } from "../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts";
import { firstLetterCapitalized } from "./built-steps/build-swift-theme-structs/build-swift-theme-structs.ts";
import { enumPrefix } from "./CONSTANTS.ts";

export function getTokenGroupName(token: GenericDesignTokensCollectionToken): string {
    return `${enumPrefix}${firstLetterCapitalized(token.name[0])}`;
}

export function tokenToSwiftValue(prefix: string, token: GenericDesignTokensCollectionToken) {
    const groupName = getTokenGroupName(token);
    const tokenName = segmentsToSwiftIdentifier(token.name, 1);

    return `${prefix}.${groupName}.${tokenName}`
}