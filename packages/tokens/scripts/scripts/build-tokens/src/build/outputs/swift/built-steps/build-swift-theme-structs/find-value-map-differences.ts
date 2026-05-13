export interface ValueMapDifference {
    key: string;
    value: string;
}

export function findValueMapDifferences(
    valueMap: Map<string, string>,
    modifierValueMap: Map<string, string>,
): ValueMapDifference[] {
    const differences: ValueMapDifference[] = [];

    for (const [key, value] of modifierValueMap) {
        if (valueMap.get(key) !== value) {
            differences.push({ key, value });
        }
    }

    return differences;
}
