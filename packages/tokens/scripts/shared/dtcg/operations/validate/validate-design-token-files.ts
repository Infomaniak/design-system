import { glob } from 'node:fs/promises';
import { readJsonFile } from '../../../../../../../scripts/helpers/file/read-json-file.ts';
import { validateDesignTokensTree } from './validate-design-tokens-tree.ts';

export async function validateDesignTokenFiles(sources: readonly string[]): Promise<void> {
  for (const path of sources) {
    for await (const entry of glob(path)) {
      validateDesignTokensTree(await readJsonFile(entry));
    }
  }
}
