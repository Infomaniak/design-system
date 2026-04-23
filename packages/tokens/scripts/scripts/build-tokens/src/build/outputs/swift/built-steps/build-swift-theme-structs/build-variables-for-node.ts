import type { SwiftVariable } from '../../helpers/build-swift-file-with-init.ts';
import { getSharedStructName } from './find-repeated-structures.ts';
import type { NestedMap } from './find-repeated-structures.ts';
import { toSwiftVariableName } from '../../swift-naming-helper.ts';

function resolveType(value: NestedMap | string, patterns: Map<NestedMap, string[][]>): string {
    if (typeof value === 'string') return value;
    return getSharedStructName(value, patterns) ?? 'Unknown';
}

export function buildVariablesForNode(
    node: NestedMap,
    patterns: Map<NestedMap, string[][]>,
): SwiftVariable[] {
    const variables: SwiftVariable[] = [];
    const stringEntries = Object.entries(node).filter(([, v]) => typeof v === 'string');
    const objectEntries = Object.entries(node).filter(([, v]) => typeof v !== 'string');

    if (stringEntries.length > 0 && objectEntries.length > 0) {
        // Root support
        const stringSubMap = Object.fromEntries(stringEntries) as NestedMap;
        const rootStructName = getSharedStructName(stringSubMap, patterns);
        if (rootStructName) {
            variables.push({ name: 'root', type: rootStructName });
        } else {
            for (const [key, value] of stringEntries) {
                variables.push({ name: toSwiftVariableName([key]), type: value as string });
            }
        }
    } else {
        for (const [key, value] of stringEntries) {
            variables.push({ name: toSwiftVariableName([key]), type: value as string });
        }
    }

    for (const [key, value] of objectEntries) {
        const sharedName = getSharedStructName(value as NestedMap, patterns);
        variables.push({ name: toSwiftVariableName([key]), type: sharedName ?? resolveType(value, patterns) });
    }

    return variables;
}
