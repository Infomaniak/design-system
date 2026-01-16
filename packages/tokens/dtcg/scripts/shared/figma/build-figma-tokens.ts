import { writeFile } from 'node:fs/promises';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { DesignTokensCollection } from '../dtcg/resolver/design-tokens-collection.ts';
import { designTokensCollectionToFigma } from '../dtcg/resolver/to/figma/design-tokens-collection-to-figma.ts';

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

  // await debugDesignTokensCollection([`${sourceDirectory}/base/**/*.tokens.json`]);

  const tiers: readonly string[] = ['t1-primitive', 't2-semantic', 't3-component'];
  // const themes: readonly string[] = ['dark', 'light'];

  const collection = new DesignTokensCollection();

  await collection.fromFiles(
    tiers.map((tier: string): string => `${sourceDirectory}/base/${tier}/**/*.tokens.json`),
  );

  for (const token of collection.getMergedTokens()) {
    for (const tier of tiers) {
      if (token.file?.includes(tier)) {
        collection.rename(token.name, [tier, ...token.name]);
      }
    }
  }

  const figmaTokens: unknown = designTokensCollectionToFigma(collection);

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
