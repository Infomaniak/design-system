import { segmentsReferenceToPascalCase } from '../../../../../../../../../shared/dtcg/design-token/reference/types/segments/to/pascal-case/segments-reference-to-pascal-case.ts';

export type NestedMap = { [key: string]: NestedMap | string };

export function normalize(obj: NestedMap): NestedMap | string {
    if (typeof obj === 'string') return obj;
    return Object.fromEntries(
        Object.entries(obj)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => [k, normalize(v as NestedMap)]),
    );
}

function collectSignatures(
    node: NestedMap | string,
    path: string[],
    signatures: Map<NestedMap, string[][]>,
): void {
    if (typeof node === 'string') return;

    const sig = JSON.stringify(normalize(node));
    const existing = [...signatures.entries()].find(([k]) => JSON.stringify(normalize(k)) === sig);

    if (existing) {
        existing[1].push(path);
    } else {
        signatures.set(node, [path]);
    }

    for (const [key, value] of Object.entries(node)) {
        collectSignatures(value as NestedMap, [...path, key], signatures);
    }
}

export function findRepeatedStructures(obj: NestedMap): Map<NestedMap, string[][]> {
    const signatures = new Map<NestedMap, string[][]>();
    collectSignatures(obj, [], signatures);
    return new Map([...signatures].filter(([, paths]) => paths.length > 1));
}

function commonSegments(paths: string[][]): string[] {
    if (paths.length === 0) return [];
    const maxLen = Math.max(...paths.map((p) => p.length));
    const common: string[] = [];
    for (let i = 0; i < maxLen; i++) {
        const values = paths.map((p) => p[i]).filter(Boolean);
        const unique = new Set(values);
        if (unique.size === 1) common.push(values[0]);
    }
    return common;
}

export function nameForPatternPaths(paths: string[][]): string {
    return segmentsReferenceToPascalCase(commonSegments(paths)) + 'Options';
}

export function getSharedStructName(
    node: NestedMap,
    patterns: Map<NestedMap, string[][]>,
): string | undefined {
    const sig = JSON.stringify(normalize(node));
    const entry = [...patterns.entries()].find(([k]) => JSON.stringify(normalize(k)) === sig);
    return entry ? nameForPatternPaths(entry[1]) : undefined;
}