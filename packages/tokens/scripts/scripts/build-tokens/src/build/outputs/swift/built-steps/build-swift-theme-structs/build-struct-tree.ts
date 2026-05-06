import { join } from 'node:path';
import { dedent } from '../../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import { writeTextFileSafe } from '../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { segmentsReferenceToPascalCase } from '../../../../../../../../shared/dtcg/design-token/reference/types/segments/to/pascal-case/segments-reference-to-pascal-case.ts';
import { buildSwiftStructWithInit } from '../../helpers/build-swift-file-with-init.ts';
import { getSharedStructName } from './find-repeated-structures.ts';
import type { NestedMap } from './find-repeated-structures.ts';
import { buildVariablesForNode } from './build-variables-for-node.ts';
import { toSwiftVariableName } from '../../swift-naming-helper.ts';

function buildInitValue(
    structTypeName: string,
    node: NestedMap,
    path: string[],
    patterns: Map<NestedMap, string[][]>,
    valueMap: Map<string, string>,
): string {
    const args: string[] = [];
    const stringEntries = Object.entries(node).filter(([, v]) => typeof v === 'string');
    const objectEntries = Object.entries(node).filter(([, v]) => typeof v !== 'string');

    if (stringEntries.length > 0 && objectEntries.length > 0) {
        // Root support: mixed string + object entries
        const stringSubMap = Object.fromEntries(stringEntries) as NestedMap;
        const rootStructName = getSharedStructName(stringSubMap, patterns);
        if (rootStructName) {
            args.push(`root: ${buildInitValue(rootStructName, stringSubMap, path, patterns, valueMap)}`);
        } else {
            for (const [key] of stringEntries) {
                const val = valueMap.get(JSON.stringify([...path, key])) ?? 'nil';
                args.push(`${toSwiftVariableName([key])}: ${val}`);
            }
        }
    } else {
        for (const [key] of stringEntries) {
            const val = valueMap.get(JSON.stringify([...path, key])) ?? 'nil';
            args.push(`${toSwiftVariableName([key])}: ${val}`);
        }
    }

    for (const [key, value] of objectEntries) {
        const sharedName = getSharedStructName(value as NestedMap, patterns);
        if (sharedName) {
            // Shared struct (e.g. ColorOptions): no default init, must fully expand
            args.push(`${toSwiftVariableName([key])}: ${buildInitValue(sharedName, value as NestedMap, [...path, key], patterns, valueMap)}`);
        } else {
            const childEntries = Object.entries(value as NestedMap);
            if (childEntries.length === 1 && typeof childEntries[0][1] === 'string') {
                const [leafKey] = childEntries[0];
                const val = valueMap.get(JSON.stringify([...path, key, leafKey])) ?? 'nil';
                args.push(`${toSwiftVariableName([key, leafKey])}: ${val}`);
            } else {
                // Unique EsdsThemeXxx struct: has its own defaulted init, just call TypeName()
                const subTypeName = structTypeName + segmentsReferenceToPascalCase([key]);
                args.push(`${toSwiftVariableName([key])}: ${subTypeName}()`);
            }
        }
    }

    return dedent`
        ${structTypeName}(
            ${args.join(',\n')}
        )
        `;
}

export async function buildStructTree(
    node: NestedMap,
    path: string[],
    patterns: Map<NestedMap, string[][]>,
    outputDirectory: string,
    valueMap: Map<string, string>,
): Promise<void> {
    const name =
        path.length === 0 ? 'EsdsTheme' : segmentsReferenceToPascalCase(path);

    const variables = buildVariablesForNode(node, patterns);

    // Set initValue for string (leaf) entries directly in this node
    const stringEntries = Object.entries(node).filter(([, v]) => typeof v === 'string');
    const hasObjectEntries = Object.entries(node).some(([, v]) => typeof v !== 'string');
    if (stringEntries.length > 0 && hasObjectEntries) {
        // Root support case
        const stringSubMap = Object.fromEntries(stringEntries) as NestedMap;
        const rootStructName = getSharedStructName(stringSubMap, patterns);
        if (rootStructName) {
            const rootIdx = variables.findIndex((v) => v.name === 'root');
            if (rootIdx !== -1) variables[rootIdx].initValue = buildInitValue(rootStructName, stringSubMap, path, patterns, valueMap);
        } else {
            for (const [key] of stringEntries) {
                const idx = variables.findIndex((v) => v.name === toSwiftVariableName([key]));
                if (idx !== -1) variables[idx].initValue = valueMap.get(JSON.stringify([...path, key]));
            }
        }
    } else {
        for (const [key] of stringEntries) {
            const idx = variables.findIndex((v) => v.name === toSwiftVariableName([key]));
            if (idx !== -1) variables[idx].initValue = valueMap.get(JSON.stringify([...path, key]));
        }
    }

    const objectEntries = Object.entries(node).filter(([, v]) => typeof v !== 'string');
    for (const [key, value] of objectEntries) {
        const sharedName = getSharedStructName(value as NestedMap, patterns);
        const idx = variables.findIndex((v) => v.name === toSwiftVariableName([key]));

        if (!sharedName) {
            const childEntries = Object.entries(value as NestedMap);

            if (childEntries.length === 1 && typeof childEntries[0][1] === 'string') {
                // Single leaf: inline as combinedName, no sub-struct created
                const [leafKey, leafType] = childEntries[0];
                const initVal = valueMap.get(JSON.stringify([...path, key, leafKey]));
                if (idx !== -1) variables[idx] = { name: toSwiftVariableName([key, leafKey]), type: leafType as string, initValue: initVal };
            } else {
                const typeName = name + segmentsReferenceToPascalCase([key]);
                // Unique EsdsThemeXxx struct: has its own defaulted init, just call TypeName()
                if (idx !== -1) variables[idx] = { name: toSwiftVariableName([key]), type: typeName, initValue: `${typeName}()` };
                await buildStructTree(value as NestedMap, [...path, key], patterns, outputDirectory, valueMap);
            }
        } else {
            // Shared struct: set initValue
            const initVal = buildInitValue(sharedName, value as NestedMap, [...path, key], patterns, valueMap);
            if (idx !== -1) variables[idx] = { ...variables[idx], initValue: initVal };
        }
    }

    const swiftStruct = buildSwiftStructWithInit({ name, variables });
    await writeTextFileSafe(join(outputDirectory, `EsdsTheme/${name}.swift`), swiftStruct);
}
