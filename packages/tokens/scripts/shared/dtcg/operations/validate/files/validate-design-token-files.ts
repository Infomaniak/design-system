import { glob } from 'node:fs/promises';
import { readJsonFile } from '../../../../../../../../scripts/helpers/file/read-json-file.ts';
import { validateDesignTokensTreeSchema } from '../schema/tree/validate-design-tokens-tree-schema.ts';

export async function validateDesignTokenFiles(sources: readonly string[]): Promise<void> {
  for (const path of sources) {
    for await (const entry of glob(path)) {
      validateDesignTokensTreeSchema(await readJsonFile(entry), {
        file: entry,
        name: [],
        type: undefined,
      });
    }
  }
}
