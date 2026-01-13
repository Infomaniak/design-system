import { writeFile } from 'node:fs/promises';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { DesignTokensGroup } from '../dtcg/design-token/group/design-tokens-group.ts';
import { hasExistingSegmentsReference } from '../dtcg/design-token/reference/types/segments/resolve/has-existing-segments-reference.ts';
import type { SegmentsReference } from '../dtcg/design-token/reference/types/segments/segments-reference.ts';
import { segmentsReferenceToCurlyReference } from '../dtcg/design-token/reference/types/segments/to/curly-reference/segments-reference-to-curly-reference.ts';
import type { DesignTokensTree } from '../dtcg/design-token/tree/design-tokens-tree.ts';
import { mergeDesignTokenFiles } from '../dtcg/operations/merge/merge-design-token-files.ts';
import { designTokenTreeToFigmaFormat } from '../dtcg/to/figma/design-token-tree-to-figma-format.ts';

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

  const tiers: readonly string[] = ['t1-primitive', 't2-semantic', 't3-component'];
  Object.fromEntries(
    tiers.map((tier: string): [string, string] => [
      tier,
      `${sourceDirectory}/base/${tier}/**/*.tokens.json`,
    ]),
  );

  const figmaTokens: DesignTokensGroup = designTokenTreeToFigmaFormat(
    Object.fromEntries(
      await Promise.all(
        tiers.map(async (tier: string): Promise<[string, DesignTokensTree]> => {
          return [
            tier,
            await mergeDesignTokenFiles([`${sourceDirectory}/base/${tier}/**/*.tokens.json`]),
          ];
        }),
      ),
    ),
  );
  // const figmaTokens: DesignTokensGroup = designTokenTreeToFigmaFormat({
  //   't1-primitive': await mergeDesignTokenFiles([
  //     `${sourceDirectory}/base/t1-primitive/**/*.tokens.json`,
  //   ]),
  // });

  // console.dir(figmaTokens, { depth: null });
  // await writeFile(`${outputDirectory}/figma.json`, JSON.stringify(figmaTokens, null, 2));

  const content: string = JSON.stringify(figmaTokens, null, 2).replaceAll(
    /"\{([^\}]+)\}"/g,
    (_, curlyReference: string): string => {
      const reference: SegmentsReference = curlyReference.split('.');
      for (const tier of tiers) {
        if (hasExistingSegmentsReference([tier, ...reference], figmaTokens)) {
          return JSON.stringify(segmentsReferenceToCurlyReference([tier, ...reference]));
        }
      }
      throw new Error(`No token found for reference {${curlyReference}}.`);
    },
  );

  // console.log(content);
  // const allTokens: DesignTokensTree = await mergeDesignTokenFiles([
  //   `${sourceDirectory}/base/t1-primitive/**/*.tokens.json`,
  //   `${sourceDirectory}/base/t2-semantic/**/*.tokens.json`,
  //   `${sourceDirectory}/base/t3-component/**/*.tokens.json`,
  // ]);

  await writeFile(`${outputDirectory}/figma.json`, content);

  // for await (const entry of glob(`${sourceDirectory}/themes/**/*.tokens.json`)) {
  //   const tokens: any = JSON.parse(
  //     await readFile(entry, {
  //       encoding: 'utf-8',
  //     }),
  //   );
  //
  //   allTokens = mergeDesignTokens(allTokens, tokens);
  // }

  // console.log(allTokens);
}
