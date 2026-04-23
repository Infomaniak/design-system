import { join } from "node:path";
import { writeTextFileSafe } from "../../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts";
import { buildSwiftStructWithInit } from "../../helpers/build-swift-file-with-init.ts";
import { buildVariablesForNode } from "./build-variables-for-node.ts";
import { nameForPatternPaths, type NestedMap } from "./find-repeated-structures.ts";

export async function buildReapeatedStructures(patterns: Map<NestedMap, string[][]>, outputDirectory: string) {
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
}