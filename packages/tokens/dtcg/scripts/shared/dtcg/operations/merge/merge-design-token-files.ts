import { glob, readFile } from 'node:fs/promises';
import type { DesignTokensTree } from '../../design-token/tree/design-tokens-tree.ts';
import {
  type MergeDesignTokensGroupsOptions,
  mergeDesignTokensTrees,
} from './merge-design-tokens-trees.ts';

export interface MergeDesignTokenFilesOptions extends MergeDesignTokensGroupsOptions {}

export async function mergeDesignTokenFiles(
  sources: readonly string[],
  options?: MergeDesignTokenFilesOptions,
): Promise<DesignTokensTree> {
  let allTokens: DesignTokensTree = {};

  for (const path of sources) {
    for await (const entry of glob(path)) {
      try {
        allTokens = mergeDesignTokensTrees(
          allTokens,
          JSON.parse(
            await readFile(entry, {
              encoding: 'utf-8',
            }),
          ),
          options,
        );
      } catch (error: unknown) {
        throw new Error(`Error on file "${entry}": ${(error as Error).message}`, {
          cause: error,
        });
      }
    }
  }

  return allTokens;
}
