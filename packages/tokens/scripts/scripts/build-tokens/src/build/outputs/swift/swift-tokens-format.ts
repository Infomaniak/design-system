import { cleanSwiftName } from "../../../../../../shared/dtcg/resolver/to/swift/token/name/clean-swift-name-segment.ts";
import type { GenericDesignTokensCollectionToken } from "../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts";
import { firstLetterCapitalized } from "./built-steps/build-swift-theme-structs/build-swift-theme-structs.ts";

export function getTokenGroupName(token: GenericDesignTokensCollectionToken): string {
    return cleanSwiftName(firstLetterCapitalized(token.name[0]));
}

export function tokenToSwiftValue(prefix: string, groupName: string, tokenName: string) {
    return `${prefix}.${groupName}.${tokenName}`
}