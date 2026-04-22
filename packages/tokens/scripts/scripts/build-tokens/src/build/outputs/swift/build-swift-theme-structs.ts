import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { segmentsReferenceToPascalCase } from '../../../../../../shared/dtcg/design-token/reference/types/segments/to/pascal-case/segments-reference-to-pascal-case.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import {
  type GenericDesignTokensCollectionToken,
  type GenericResolvedDesignTokensCollectionToken,
} from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import type { ArrayDesignTokenName } from '../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { T2_DIRECTORY_NAME } from '../../../constants/design-token-tiers.ts';
import {
  buildSwiftStructWithInit,
  type SwiftVariable,
} from './helpers/build-swift-file-with-init.ts';
import { toSwiftVariableName } from './swift-naming-helper.ts';

type NestedMap = { [key: string]: NestedMap | string };

export interface BuildSwiftThemeStructOptions {
  readonly baseCollection: DesignTokensCollection;
  readonly outputDirectory: string;
}

const TYPE_SWIFT_MAP: Record<string, string> = {
  color: 'Color',
  dimension: 'CGFloat',
  number: 'CGFloat',
  fontFamily: 'String',
  fontWeight: 'Font.Weight',
};

export async function buildSwiftThemeStructs({
  baseCollection,
  outputDirectory,
}: BuildSwiftThemeStructOptions) {
  const names: readonly ArrayDesignTokenName[] = Array.from(
    baseCollection
      .tokens()
      .filter((token: GenericDesignTokensCollectionToken): boolean => {
        return token.files.some((path: string): boolean => path.includes(T2_DIRECTORY_NAME));
      })
      .map((token: GenericDesignTokensCollectionToken): ArrayDesignTokenName => {
        return token.name;
      }),
  );

  const buildedTree: NestedMap = buildTokenTree(baseCollection, names, TYPE_SWIFT_MAP, "String?");

  const patterns = findRepeatedStructures(buildedTree);

  for (const [sig, paths] of patterns) {
    const structName = nameForPatternPaths(paths);
    const swiftStruct = buildSwiftStructWithInit({
      name: structName,
      variables: buildVariablesForNode(sig, patterns),
    });

    await writeTextFileSafe(
      join(outputDirectory, `EsdsTheme/Shared/${structName}.swift`),
      swiftStruct,
    );
  }

  await buildStructTree(buildedTree, [], patterns, outputDirectory);
}

function buildTokenTree(
  baseCollection: DesignTokensCollection,
  names: readonly ArrayDesignTokenName[],
  platformTypeRecord: Record<string, string>,
  undefinedType: string
): NestedMap {
  const buildedTree2: NestedMap = {};

  for (const name of names) {
    let node = buildedTree2;
    for (let i = 0; i < name.length; i++) {
      const key = name[i];
      if (i === name.length - 1) {
        const resolvedToken: GenericResolvedDesignTokensCollectionToken = baseCollection.resolve(
          baseCollection.get(name),
        );
        node[key] = platformTypeRecord[resolvedToken.type] ?? undefinedType;
        break;
      }
      if (!node[key]) node[key] = {};
      node = node[key] as NestedMap;
    }
  }

  return buildedTree2;
}

function normalize(obj: NestedMap): NestedMap | string {
  if (typeof obj === "string") return obj;
  return Object.fromEntries(
    Object.entries(obj)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, normalize(v as NestedMap)])
  );
}

function collectSignatures(node: NestedMap | string, path: string[], signatures: Map<NestedMap, string[][]>): void {
  if (typeof node === "string") return;

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

function findRepeatedStructures(obj: NestedMap): Map<NestedMap, string[][]> {
  const signatures = new Map<NestedMap, string[][]>();
  collectSignatures(obj, [], signatures);
  return new Map([...signatures].filter(([, paths]) => paths.length > 1));
}

function commonSegments(paths: string[][]): string[] {
  if (paths.length === 0) return [];
  const maxLen = Math.max(...paths.map(p => p.length));
  const common: string[] = [];
  for (let i = 0; i < maxLen; i++) {
    const values = paths.map(p => p[i]).filter(Boolean);
    const unique = new Set(values);
    if (unique.size === 1) common.push(values[0]);
  }
  return common;
}

function nameForPatternPaths(paths: string[][]): string {
  return segmentsReferenceToPascalCase(commonSegments(paths)) + 'Options';
}

function getSharedStructName(
  node: NestedMap,
  patterns: Map<NestedMap, string[][]>,
): string | undefined {
  const sig = JSON.stringify(normalize(node));
  const entry = [...patterns.entries()].find(([k]) => JSON.stringify(normalize(k)) === sig);
  return entry ? nameForPatternPaths(entry[1]) : undefined;
}

async function buildStructTree(
  node: NestedMap,
  path: string[],
  patterns: Map<NestedMap, string[][]>,
  outputDirectory: string,
): Promise<void> {
  const name =
    path.length === 0 ? 'EsdsTheme' : `EsdsTheme${segmentsReferenceToPascalCase(path)}`;

  // Build variables using the shared helper (handles root grouping + shared struct resolution)
  const variables = buildVariablesForNode(node, patterns);

  // For object entries that are NOT a shared struct, override with EsdsTheme<Path> type and recurse
  const objectEntries = Object.entries(node).filter(([, v]) => typeof v !== 'string');
  for (const [key, value] of objectEntries) {
    const sharedName = getSharedStructName(value as NestedMap, patterns);

    if (!sharedName) {
      const idx = variables.findIndex(v => v.name === toSwiftVariableName([key]));
      const childEntries = Object.entries(value as NestedMap);

      if (childEntries.length === 1 && typeof childEntries[0][1] === 'string') {
        // Single leaf: inline as combinedName, no sub-struct created
        const [leafKey, leafType] = childEntries[0];
        if (idx !== -1) variables[idx] = { name: toSwiftVariableName([key, leafKey]), type: leafType as string };
      } else {
        const typeName = name + segmentsReferenceToPascalCase([key]);

        if (idx !== -1) variables[idx] = { name: toSwiftVariableName([key]), type: typeName };
        await buildStructTree(value as NestedMap, [...path, key], patterns, outputDirectory);
      }
    }
  }

  const swiftStruct = buildSwiftStructWithInit({ name, variables });
  await writeTextFileSafe(join(outputDirectory, `EsdsTheme/${name}.swift`), swiftStruct);
}

function resolveType(value: NestedMap | string, patterns: Map<NestedMap, string[][]>): string {
  if (typeof value === 'string') return value;
  return getSharedStructName(value, patterns) ?? 'Unknown';
}

function buildVariablesForNode(
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