import { writeFileSafe } from '../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../../../shared/dtcg/resolver/design-tokens-collection.ts';
import { designTokensCollectionToFigmaObject } from '../../../shared/dtcg/resolver/to/figma/design-tokens-collection-to-figma-object.ts';
import { mergeFigmaTokensAsModes } from '../../../shared/figma/merge/merge-figma-tokens-as-modes.ts';

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

    const tiers: readonly string[] = ['t1-primitive', 't2-semantic', 't3-component'];
    const themes: readonly string[] = ['light', 'dark'];

    const baseCollection: DesignTokensCollection = await new DesignTokensCollection().fromFiles(
      tiers.map((tier: string): string => `${sourceDirectory}/base/${tier}/**/*.tokens.json`),
    );

    const themeCollections: readonly DesignTokensCollection[] = await Promise.all(
      themes.map(async (theme: string): Promise<DesignTokensCollection> => {
        const collection = await baseCollection
          .clone()
          .fromFiles([`${sourceDirectory}/themes/${theme}.tokens.json`]);

        main: for (const token of collection.getMergedTokens()) {
          for (const tier of tiers) {
            if (token.files.some((path: string): boolean => path.includes(tier))) {
              collection.rename(token.name, [tier, ...token.name]);

              continue main;
            }
          }

          throw new Error(
            `Token ${DesignTokensCollection.arrayDesignTokenNameToCurlyReference(token.name)} does not belong to a tier.`,
          );
        }

        return collection;
      }),
    );

    const figmaTokens = mergeFigmaTokensAsModes(
      themeCollections.map(
        (collection: DesignTokensCollection, index: number): [string, unknown] => {
          return [
            index === 0 ? 'Mode 1' : themes[index],
            designTokensCollectionToFigmaObject(collection),
          ];
        },
      ),
    );

    await writeFileSafe(
      `${outputDirectory}/figma.tokens.json`,
      JSON.stringify(figmaTokens, null, 2),
    );
  });
}
