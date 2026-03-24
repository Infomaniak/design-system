import StyleDictionary from "style-dictionary";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSwift } from "./build-swift.ts";
import { collectTokens, registerHooks, type BuildContext } from "./context.ts";
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { DESIGN_TOKEN_TIERS } from "./helpers.ts";

export interface BuildSwiftTokensOptions {
    readonly sourceDirectory: string;
    readonly outputDirectory: string;
    readonly logger: Logger;
}

export async function buildSwiftTokens({
    sourceDirectory,
    outputDirectory,
    logger,
}: BuildSwiftTokensOptions) {
    return logger.asyncTask('swift', async (): Promise<void> => {

        registerHooks(StyleDictionary);

        const baseSources = DESIGN_TOKEN_TIERS.map(
            (tier) => `${sourceDirectory}/${tier}/**/*.tokens.json`,
        );
        const baseTokens = await collectTokens(baseSources);

        const __dirname = dirname(fileURLToPath(import.meta.url));
        const ROOT_DIR = join(__dirname, '..');

        const ctx: BuildContext = {
            tokensDir: sourceDirectory,
            distDir: outputDirectory,
            rootDir: ROOT_DIR,
            baseSources,
            baseTokens,
        };

        buildSwift(ctx);
    });
}