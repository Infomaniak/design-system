import { writeFile } from 'node:fs/promises';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import type { DesignTokensGroup } from '../dtcg/design-token/group/design-tokens-group.ts';
import { mergeDesignTokenFiles } from '../dtcg/operations/merge/merge-design-token-files.ts';

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

  const allTokens: DesignTokensGroup = await mergeDesignTokenFiles([
    `${sourceDirectory}/base/t1-primitive/**/*.tokens.json`,
    `${sourceDirectory}/base/t2-semantic/**/*.tokens.json`,
    `${sourceDirectory}/base/t3-component/**/*.tokens.json`,
  ]);

  await writeFile(`${outputDirectory}/all.json`, JSON.stringify(allTokens, null, 2));

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
