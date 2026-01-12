import { glob, readFile } from 'node:fs/promises';
import { removeTrailingSlash } from '../../../../../../scripts/helpers/path/remove-traling-slash.ts';

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

  const output: any = {};

  for (const path of base) {
    for await (const entry of glob(path)) {
      const content: any = JSON.parse(
        await readFile(entry, {
          encoding: 'utf-8',
        }),
      );
      console.log(content);
    }
  }

  console.log(output);
}

function mergeTokens(tokens: any): any {
  return tokens;
}
