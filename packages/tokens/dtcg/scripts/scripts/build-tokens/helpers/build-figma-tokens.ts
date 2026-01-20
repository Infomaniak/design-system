import { glob } from 'node:fs/promises';
import { basename } from 'node:path';
import { writeFileSafe } from '../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { setObjectDeepProperty } from '../../../../../../../scripts/helpers/misc/object/set-object-deep-property.ts';
import { removeTrailingSlash } from '../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { FigmaDesignTokensGroup } from '../../../shared/dtcg/resolver/to/figma/figma/group/figma-design-tokens-group.ts';
import { designTokensCollectionTokenToFigmaDesignTokensTree } from '../../../shared/dtcg/resolver/to/figma/token/design-tokens-collection-token-to-figma-design-tokens-tree.ts';
import {
  mergeFigmaDesignTokensTreesAsModes,
  type NamedFigmaTokens,
} from '../../../shared/figma/merge/merge-figma-design-tokens-trees-as-modes.ts';
import { DESIGN_TOKEN_TIERS, type DesignTokenTier } from './design-token-tiers.ts';

export interface BuildFigmaTokensOptions {
  readonly sourceDirectory: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export function buildFigmaTokens({
  sourceDirectory,
  outputDirectory,
  logger,
}: BuildFigmaTokensOptions): Promise<void> {
  return logger.asyncTask('figma', async (): Promise<void> => {
    sourceDirectory = removeTrailingSlash(sourceDirectory);
    outputDirectory = removeTrailingSlash(outputDirectory);

    // 1) create a base collection (contains all the t1, t2, t3 tokens)
    const baseCollection: DesignTokensCollection = await new DesignTokensCollection().fromFiles(
      DESIGN_TOKEN_TIERS.map(
        (tier: string): string => `${sourceDirectory}/base/${tier}/**/*.tokens.json`,
      ),
    );

    // 2) load themes/variants
    const themeCollections: Map<string, DesignTokensCollection> = new Map();
    const patchCollections: Map<string, DesignTokensCollection> = new Map();

    for await (const entry of glob(`${sourceDirectory}/themes/**/*.tokens.json`)) {
      const collection: DesignTokensCollection = await loadFigmaThemeTokens(baseCollection, entry);

      const name: string = basename(entry, '.tokens.json');
      const isPatch: boolean = name.endsWith('.patch');

      if (isPatch) {
        patchCollections.set(name.slice(0, -'.patch'.length), collection);
      } else {
        themeCollections.set(name, collection);
      }
    }

    // 3) create figma tokens
    const figmaTokens: FigmaDesignTokensGroup = {};

    // 3.1) t1-primitive -> t1 tokens contain all the values, thus, they don't have alternative modes.
    const t1: DesignTokenTier = DESIGN_TOKEN_TIERS[0];
    const mainCollection: DesignTokensCollection = themeCollections.get('light')!;
    for (const token of mainCollection.getMergedTokens()) {
      if (token.name.at(0) === t1) {
        setObjectDeepProperty(
          figmaTokens,
          token.name,
          designTokensCollectionTokenToFigmaDesignTokensTree(token, mainCollection.resolve(token)),
        );
      }
    }

    // 3.2) t2-semantic, t3-component -> t2, t3 tokens contain alternative, build from the `themeCollections`, thus, they need to be merged (as modes).
    const t2t3 = new Set(DESIGN_TOKEN_TIERS.slice(1));
    Object.assign(
      figmaTokens,
      mergeFigmaDesignTokensTreesAsModes(
        Array.from(themeCollections.entries()).map(
          (
            [name, collection]: [string, DesignTokensCollection],
            index: number,
          ): NamedFigmaTokens => {
            const figmaTokens: FigmaDesignTokensGroup = {};

            for (const token of collection.getMergedTokens()) {
              if (t2t3.has(token.name.at(0) as DesignTokenTier)) {
                setObjectDeepProperty(
                  figmaTokens,
                  token.name,
                  designTokensCollectionTokenToFigmaDesignTokensTree(
                    token,
                    collection.resolve(token),
                  ),
                );
              }
            }

            // const mode: string = index === 0 ? 'Mode 1' : name;
            const mode: string = name;

            return [mode, figmaTokens];
          },
        ),
      ),
    );

    // 3.3) variants -> `.patch` tokens create "variants": a collection with tokens overloading existing ones.
    for (const [name, collection] of patchCollections.entries()) {
      for (const token of collection.getMergedTokens()) {
        if (
          token.files.some((path: string): boolean => path.endsWith(`${name}.patch.tokens.json`))
        ) {
          setObjectDeepProperty(
            figmaTokens,
            [`variant/${name}`, ...token.name.slice(1)],
            designTokensCollectionTokenToFigmaDesignTokensTree(token, collection.resolve(token)),
          );
        }
      }
    }

    // 4) write figma tokens to file
    await writeFileSafe(
      `${outputDirectory}/figma.tokens.json`,
      JSON.stringify(figmaTokens, null, 2),
    );
  });
}

/*--------------*/

/**
 * Loads a **theme**, with renamed tokens to match the corresponding tier, as a design tokens collection.
 */
async function loadFigmaThemeTokens(
  baseCollection: DesignTokensCollection,
  path: string,
): Promise<DesignTokensCollection> {
  const collection: DesignTokensCollection = await baseCollection.clone().fromFiles([path]);

  for (const token of collection.getMergedTokens()) {
    const tier: DesignTokenTier | undefined = DESIGN_TOKEN_TIERS.find(
      (tier: DesignTokenTier): boolean => {
        return token.files.some((path: string): boolean => path.includes(tier));
      },
    );

    if (tier === undefined) {
      throw new Error(
        `Token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} does not belong to a tier.`,
      );
    }

    collection.rename(token.name, [tier, ...token.name]);
  }

  return collection;
}
