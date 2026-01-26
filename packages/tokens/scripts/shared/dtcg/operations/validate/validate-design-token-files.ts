import { glob, readFile } from 'node:fs/promises';
import { validateDesignTokensTree } from './validate-design-tokens-tree.ts';

export async function validateDesignTokenFiles(sources: readonly string[]): Promise<void> {
  for (const path of sources) {
    for await (const entry of glob(path)) {
      validateDesignTokensTree(
        JSON.parse(
          await readFile(entry, {
            encoding: 'utf-8',
          }),
        ),
      );
    }
  }
}
