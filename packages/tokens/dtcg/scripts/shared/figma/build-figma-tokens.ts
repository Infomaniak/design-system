import { writeFile } from 'node:fs/promises';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../dtcg/resolver/design-tokens-collection.ts';
import { CssVariablesCollection } from '../dtcg/resolver/to/css/css-variables-collection.ts';
import { designTokensCollectionToFigmaObject } from '../dtcg/resolver/to/figma/design-tokens-collection-to-figma-object.ts';
import { mergeFigmaTokensAsModes } from './merge/merge-figma-tokens-as-modes.ts';

export interface BuildFigmaTokensOptions {
  readonly sourceDirectory: string;
  readonly outputDirectory: string;
}

export async function buildFigmaTokens({
  sourceDirectory,
  outputDirectory,
}: BuildFigmaTokensOptions): Promise<void> {
  sourceDirectory = removeTrailingSlash(sourceDirectory);
  outputDirectory = removeTrailingSlash(outputDirectory);

  const themes: readonly string[] = ['light', 'dark'];
  const tiers: readonly string[] = ['t1-primitive', 't2-semantic', 't3-component'];

  const collections: readonly DesignTokensCollection[] = await Promise.all(
    themes.map(async (theme: string): Promise<DesignTokensCollection> => {
      const collection = new DesignTokensCollection();

      await collection.fromFiles([
        ...tiers.map((tier: string): string => `${sourceDirectory}/base/${tier}/**/*.tokens.json`),
        `${sourceDirectory}/themes/${theme}.tokens.json`,
      ]);

      collection.getMergedTokens();

      main: for (const token of collection.getMergedTokens()) {
        for (const tier of tiers) {
          if (token.files.some((path: string) => path.includes(tier))) {
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

  const cssCollection = new CssVariablesCollection().fromDesignTokensCollection(collections[0]);

  console.log(cssCollection.toString(':root'));

  // const figmaTokens = designTokensCollectionToFigma(collections[0]);

  const figmaTokens = mergeFigmaTokensAsModes(
    collections.map((collection: DesignTokensCollection, index: number) => {
      return [
        index === 0 ? 'Mode 1' : themes[index],
        designTokensCollectionToFigmaObject(collection),
      ];
    }),
  );

  const content: string = JSON.stringify(figmaTokens, null, 2);

  await writeFile(`${outputDirectory}/figma.tokens.json`, content);

  /*
  "$extensions": {
            "mode": {
              "Mode 1": "#0c0c0d0d",
              "Mode 2": "#0c0c0d0d"
            }
          }
   */
}
