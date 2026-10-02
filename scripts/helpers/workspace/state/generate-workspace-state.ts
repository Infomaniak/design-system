import { glob } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PackageJson } from '../../file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../file/package-json/read-package-json-file.ts';
import { toAbsolutePath } from '../../path/to-absolute-path.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../../..');

export type WorkspaceState = Record<string /* package name */, string /* version */>;

export async function generateWorkspaceState(): Promise<WorkspaceState> {
  const cwd: string = ROOT_DIR;

  return Object.fromEntries(
    await Promise.all(
      (
        await Array.fromAsync(
          glob(`**/package.json`, {
            cwd,
            exclude: [
              '**/node_modules',
              '**/dist',
              './package.json',
              'apps/docs/',
              'packages/tokens/demo/',
            ],
          }),
        )
      ).map(async (entry: string): Promise<[string, string]> => {
        const { name, version }: PackageJson = await readPackageJsonFile(
          toAbsolutePath(entry, cwd),
        );
        return [name, version];
      }),
    ),
  );
}
