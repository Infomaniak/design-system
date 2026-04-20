import { glob } from 'node:fs/promises';
import { readJsonFile } from '../../../../../../../../../../scripts/helpers/file/read-json-file.ts';
import { ensureDesignTokensTreeContainsOnlyReferences } from '../tree/ensure-design-tokens-tree-contains-only-references.ts';

export async function ensureDesignTokenFilesContainsOnlyReferences(
  sources: readonly string[],
): Promise<void> {
  for (const path of sources) {
    for await (const entry of glob(path)) {
      ensureDesignTokensTreeContainsOnlyReferences(await readJsonFile(entry), {
        file: entry,
        name: [],
        type: undefined,
      });
    }
  }
}
