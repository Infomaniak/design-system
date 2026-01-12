import { glob, readFile } from 'node:fs/promises';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';
import { mergeDesignTokens } from '../dtcg/operations/merge/merge-design-tokens.ts';

export interface BuildFigmaTokensOptions {
  readonly sourceDirectory: string;
  readonly outputDirectory: string;
}

export async function buildFigmaTokens({
  sourceDirectory,
  outputDirectory,
}: BuildFigmaTokensOptions): Promise<void> {
  sourceDirectory = removeTrailingSlash(sourceDirectory);

  const base: readonly string[] = [
    `${sourceDirectory}/base/t1-primitive/**/*.tokens.json`,
    `${sourceDirectory}/base/t2-semantic/**/*.tokens.json`,
    `${sourceDirectory}/base/t3-component/**/*.tokens.json`,
  ];

  let allTokens: any = {};

  for (const path of base) {
    for await (const entry of glob(path)) {
      const tokens: any = JSON.parse(
        await readFile(entry, {
          encoding: 'utf-8',
        }),
      );

      allTokens = mergeDesignTokens(allTokens, tokens);
    }
  }

  // for await (const entry of glob(`${sourceDirectory}/themes/**/*.tokens.json`)) {
  //   const tokens: any = JSON.parse(
  //     await readFile(entry, {
  //       encoding: 'utf-8',
  //     }),
  //   );
  //
  //   allTokens = mergeDesignTokens(allTokens, tokens);
  // }

  console.log(allTokens);
}
