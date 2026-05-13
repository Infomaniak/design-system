import { join } from "node:path";
import { writeTextFileSafe } from "../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts";
import { buildSwiftStructWithInit } from "../../helpers/build-swift-file-with-init.ts";
import { buildVariablesForNode } from "./build-variables-for-node.ts";
import { nameForPatternPaths, type NestedMap } from "./LEGACY/find-repeated-structures.ts";

async function buildReapeatedStructures(patterns: Map<string, string[]>, outputDirectory: string) {
    for (const [signature, pathJsonList] of patterns) {
        const node = JSON.parse(signature) as NestedMap;
        const paths = pathJsonList.map((pathJson) => JSON.parse(pathJson) as string[]);
        const structName = nameForPatternPaths(paths);
        const swiftStruct = buildSwiftStructWithInit({
            name: structName,
            variables: buildVariablesForNode(node, patterns),
        });

        await writeTextFileSafe(
            join(outputDirectory, `EsdsTheme/Shared/${structName}.swift`),
            swiftStruct,
        );
    }
}

export async function buildSharedStructs(
    leafGroupInverted: Map<string, string[]>,
    outputDirectory: string,
): Promise<void> {
    await buildReapeatedStructures(leafGroupInverted, outputDirectory);
}