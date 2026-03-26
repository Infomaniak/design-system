import { join } from "node:path";
import { writeTextFileSafe } from "../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts";
import type { ArrayDesignTokenName } from "../../../../../../shared/dtcg/resolver/token/name/array-design-token-name.ts";
import { buildSwiftFile } from "./build-swift-file.ts";
import { toPascalCase, toSwiftVariableName } from "./swift-naming-helper.ts";

type NestedMap = { [key: string]: NestedMap | string };

interface TokenTree {
    root: NestedMap
    leafGroups: Map<string, string[]>
}

interface StructContext {
    leafParentNameToStructName: Map<string, string>
    outputDirectory: string
}

interface BuildSwiftThemeStructOptions {
    readonly names: ArrayDesignTokenName[],
    readonly outputDirectory: string
}

export async function buildSwiftThemeStructs({
    names,
    outputDirectory
}: BuildSwiftThemeStructOptions) {

    const { leafGroups } = buildTokenTree(names);
    // Là on a genre chaque groupe de token dans le bon chemin, avec les "leaf" à la fin, donc les dernières variable, avant ça c'est des struct à chaque fois.
    // Genre: 'color-background-elevation-surface' => [ 'pressed', 'hover', 'default' ],

    // Et ici du coup on essaie de regrouper à l'inverse, on fait une array de tout ceux qui ont [ 'pressed', 'hover', 'default' ]
    const leafToParents = buildLeafToParents(leafGroups);

    const leafParentNameToStructName = await buildSharedStructs(leafToParents, outputDirectory);

    const buildedTree2: NestedMap = buildFlatTree(names, leafParentNameToStructName);

    // DEBUG:
    // console.log(JSON.stringify(buildedTree2, null, 2));

    await buildStructLeaves(buildedTree2, [], { leafParentNameToStructName, outputDirectory });
}

// HELPER

async function buildStructLeaves(
    node: NestedMap | string,
    path: string[] = [],
    structContext: StructContext,
) {
    if (typeof node === "string") return;

    const entries = Object.entries(node);

    if (entries.length === 1) {
        const [key, value] = entries[0];
        await buildStructLeaves(value, [...path, key], structContext);
        return;
    }

    const name = path.length === 0 ? "EsdsTheme" : "EsdsTheme" + toPascalCase(path);
    const fields: string[] = [];

    for (const [key, value] of entries) {
        const childPath = [...path, key];
        const commonStructName = structContext.leafParentNameToStructName.get(childPath.join("-"));
        const fieldName = toSwiftVariableName([key]);

        if (commonStructName) {
            fields.push(`public let ${fieldName}: ${commonStructName}`);
        } else if (typeof value === "string") {
            fields.push(`public let ${fieldName}: String`); // TODO: Change to token type
        } else {
            fields.push(`public let ${fieldName}: EsdsTheme${toPascalCase(childPath)}`);
            await buildStructLeaves(value, childPath, structContext);
        }
    }

    const swiftStruct = buildSwiftFile({
        imports: ["SwiftUI"],
        type: "public struct",
        name,
        content: fields.join("\n"),
    });

    await writeTextFileSafe(join(structContext.outputDirectory, `EsdsTheme/${name}.swift`), swiftStruct);
}

function buildTokenTree(names: ArrayDesignTokenName[]): TokenTree {
    const root: NestedMap = {}

    // console.log(names);

    const leafGroups = new Map<string, string[]>()

    // Build Token Tree:
    for (const name of names) {
        let current = root;
        for (let i = 0; i < name.length - 1; i++) {
            const key = name[i];
            if (!(key in current) || typeof current[key] === "string") {
                current[key] = {};
            }
            current = current[key] as NestedMap;
        }

        const leaf = name[name.length - 1];
        current[leaf] = "Value"; // TODO get the value from here

        const parents = name.toSpliced(-1, 1).join("-");
        if (!leafGroups.has(parents)) {
            leafGroups.set(parents, []);
        }
        if (!leafGroups.get(parents)!.includes(leaf)) {
            leafGroups.get(parents)!.push(leaf);
        }
    }
    return { root, leafGroups }
}

function buildLeafToParents(leafGroups: Map<string, string[]>): Map<string, string[]> {
    const leafToParents = new Map<string, string[]>();
    for (const [parent, leaves] of leafGroups) {
        if (leaves.length < 2) continue;
        const leaf = [...leaves].sort().join(",");
        if (!leafToParents.has(leaf)) {
            leafToParents.set(leaf, []);
        }
        leafToParents.get(leaf)!.push(parent);
    }
    return leafToParents
}

async function buildSharedStructs(leafToParents: Map<string, string[]>, outputDirectory: string): Promise<Map<string, string>> {
    const leafParentNameToStructName = new Map<string, string>();
    const createdStructs = new Set<string>();

    for (const [leaf, parents] of leafToParents) {
        if (parents.length < 2) continue;
        const name = toPascalCase([parents[0].split("-")[0], "options"])

        parents.forEach((parent: string) => {
            leafParentNameToStructName.set(parent, name);
        });

        if (createdStructs.has(name)) continue;

        const swiftStruct = buildSwiftFile({
            imports: ["SwiftUI"],
            type: "public struct",
            name: name,
            content: `${leaf.split(",").map((item) => `public let ${toSwiftVariableName([item.trim()])}: String`).join("\n")}` // TODO: Change value
        })

        // La on construite les fichiers pour chaque type partagé (genre ColorOptions)
        await writeTextFileSafe(
            join(outputDirectory, `EsdsTheme/Shared/${name}.swift`),
            swiftStruct,
        );

        createdStructs.add(name);
    }

    return leafParentNameToStructName
}

function buildFlatTree(names: ArrayDesignTokenName[], leafParentNameToStructName: Map<string, string>): NestedMap {
    const buildedTree2: NestedMap = {}

    for (const name of names) {
        let node = buildedTree2
        for (let i = 0; i < name.length; i++) {
            const key = name[i]
            if (i === name.length - 1) {
                node[key] = leafParentNameToStructName.get(name.toSpliced(-1, 1).join("-")) ?? "TypeOfToken"
                break
            }
            if (!node[key]) node[key] = {}
            node = node[key] as NestedMap
        }
    }

    return buildedTree2
}