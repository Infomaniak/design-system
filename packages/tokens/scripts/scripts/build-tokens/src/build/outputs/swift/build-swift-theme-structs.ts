import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { mapGetOrInsertComputed } from '../../../../../../../../../scripts/helpers/misc/map/upsert.ts';
import { segmentsReferenceToPascalCase } from '../../../../../../shared/dtcg/design-token/reference/types/segments/to/pascal-case/segments-reference-to-pascal-case.ts';
import type { ArrayDesignTokenName } from '../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts';
import { buildSwiftFile } from './helpers/build-swift-file.ts';
import { toSwiftVariableName } from './swift-naming-helper.ts';

type NestedMap = { [key: string]: NestedMap | string };

interface TokenTree {
  root: NestedMap;
  leafGroups: Map<string, string[]>;
}

interface StructContext {
  leafParentNameToStructName: Map<string, string>;
  outputDirectory: string;
}

export interface BuildSwiftThemeStructOptions {
  readonly names: readonly ArrayDesignTokenName[];
  readonly outputDirectory: string;
}

export async function buildSwiftThemeStructs({
  names,
  outputDirectory,
}: BuildSwiftThemeStructOptions) {
  const tokenNamesGroupedByLastNameSegmentMap: TokenNamesGroupedByLastNameSegmentMap =
    groupTokenNamesByLastNameSegment(names);
  // Là on a genre chaque groupe de token dans le bon chemin, avec les "leaf" à la fin, donc les dernières variable, avant ça c'est des struct à chaque fois.
  // Genre: 'color-background-elevation-surface' => [ 'pressed', 'hover', 'default' ],

  // console.log(tokenNamesGroupedByLastNameSegmentMap);

  // Et ici du coup on essaie de regrouper à l'inverse, on fait une array de tout ceux qui ont [ 'pressed', 'hover', 'default' ]
  const sharedNameSegmentsToTokenNames: SharedNameSegmentsToTokenNames =
    tokensByLastNameAndSharedSegments(tokenNamesGroupedByLastNameSegmentMap);

  // console.log(sharedNameSegmentsToTokenNames);

  const segmentsToSwiftStructMap: SegmentsToSwiftStructMap = await buildSharedStructs(
    sharedNameSegmentsToTokenNames,
    outputDirectory,
  );

  console.log(segmentsToSwiftStructMap);

  const buildedTree2: NestedMap = buildFlatTree(names, segmentsToSwiftStructMap);

  // DEBUG:
  // console.log(JSON.stringify(buildedTree2, null, 2));

  await buildStructLeaves(buildedTree2, [], {
    leafParentNameToStructName: segmentsToSwiftStructMap,
    outputDirectory,
  });
}

// HELPER

async function buildStructLeaves(
  node: NestedMap | string,
  path: string[] = [],
  structContext: StructContext,
) {
  if (typeof node === 'string') return;

  const entries = Object.entries(node);

  if (entries.length === 1) {
    const [key, value] = entries[0];
    await buildStructLeaves(value, [...path, key], structContext);
    return;
  }

  const name = path.length === 0 ? 'EsdsTheme' : 'EsdsTheme' + segmentsReferenceToPascalCase(path);
  const fields: string[] = [];

  for (const [key, value] of entries) {
    const childPath = [...path, key];
    const commonStructName = structContext.leafParentNameToStructName.get(childPath.join('-'));
    const fieldName = toSwiftVariableName([key]);

    if (commonStructName) {
      fields.push(`public let ${fieldName}: ${commonStructName}`);
    } else if (typeof value === 'string') {
      fields.push(`public let ${fieldName}: String`); // TODO: Change to token type
    } else {
      fields.push(`public let ${fieldName}: EsdsTheme${segmentsReferenceToPascalCase(childPath)}`);
      await buildStructLeaves(value, childPath, structContext);
    }
  }

  const swiftStruct = buildSwiftFile({
    imports: ['SwiftUI'],
    type: 'public struct',
    name,
    content: fields.join('\n'),
  });

  await writeTextFileSafe(
    join(structContext.outputDirectory, `EsdsTheme/${name}.swift`),
    swiftStruct,
  );
}

type TokenNamesGroupedByLastNameSegmentMap = Map<
  string /* name part */,
  string[] /* last name segment */
>;

/**
 * Constructs a tree-like map structure where token names are grouped by their last segment.
 */
function groupTokenNamesByLastNameSegment(
  names: readonly ArrayDesignTokenName[],
): TokenNamesGroupedByLastNameSegmentMap {
  const tokenNamesGroupedByLastNameSegment = new Map<
    string /* name part */,
    string[] /* last name segment */
  >();

  for (const name of names) {
    mapGetOrInsertComputed(
      tokenNamesGroupedByLastNameSegment,
      JSON.stringify(name.slice(0, -1)),
      (): string[] => [],
    ).push(name.at(-1)!);
  }

  return tokenNamesGroupedByLastNameSegment;
}

type SharedNameSegmentsToTokenNames = Map<string /* last segments joined */, string[] /* name */>;

function tokensByLastNameAndSharedSegments(
  tokenNamesGroupedByLastNameSegment: TokenNamesGroupedByLastNameSegmentMap,
): SharedNameSegmentsToTokenNames {
  const sharedNameSegmentsToTokenNames = new Map<string, string[]>();

  for (const [parent, leaves] of tokenNamesGroupedByLastNameSegment) {
    if (leaves.length < 2) {
      // skip if object is unique
      continue;
    }

    mapGetOrInsertComputed(
      sharedNameSegmentsToTokenNames,
      JSON.stringify(leaves.sort()),
      (): string[] => [],
    ).push(parent);
  }
  return sharedNameSegmentsToTokenNames;
}

type SegmentsToSwiftStructMap = Map<string /* last segments joined */, string /* struct name */>;

async function buildSharedStructs(
  leafToParents: Map<string, string[]>,
  outputDirectory: string,
): Promise<SegmentsToSwiftStructMap> {
  const segmentsToSwiftStructMap: SegmentsToSwiftStructMap = new Map<string, string>();
  const createdStructs = new Set<string>();

  for (const [leaf, parents] of leafToParents) {
    if (parents.length < 2) {
      // skip if object is unique
      continue;
    }

    const name: string = segmentsReferenceToPascalCase([JSON.parse(parents[0])[0], 'options']);

    for (const parent of parents) {
      segmentsToSwiftStructMap.set(parent, name);
    }

    if (createdStructs.has(name)) {
      continue;
    }

    const swiftStruct: string = buildSwiftFile({
      imports: ['SwiftUI'],
      type: 'public struct',
      name: name,
      content: (JSON.parse(leaf) as readonly string[])
        .map((item: string): string => {
          return `public let ${toSwiftVariableName([item.trim()])}: String`;
        })
        .join('\n'), // TODO: Change value
    });

    // La on construite les fichiers pour chaque type partagé (genre ColorOptions)
    // TODO convert path to constant
    await writeTextFileSafe(join(outputDirectory, `EsdsTheme/Shared/${name}.swift`), swiftStruct);

    createdStructs.add(name);
  }

  return segmentsToSwiftStructMap;
}

function buildFlatTree(
  names: ArrayDesignTokenName[],
  leafParentNameToStructName: Map<string, string>,
): NestedMap {
  const buildedTree2: NestedMap = {};

  for (const name of names) {
    let node = buildedTree2;
    for (let i = 0; i < name.length; i++) {
      const key = name[i];
      if (i === name.length - 1) {
        node[key] =
          leafParentNameToStructName.get(name.toSpliced(-1, 1).join('-')) ?? 'TypeOfToken';
        break;
      }
      if (!node[key]) node[key] = {};
      node = node[key] as NestedMap;
    }
  }

  return buildedTree2;
}
