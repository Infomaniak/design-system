import { join } from 'node:path';
import { readJsonFile } from '../../file/read-json-file.ts';
import { writeJsonFileSafe } from '../../file/write-json-file-safe.ts';

const PACKAGE_VERSIONS_FILE: string = 'package-versions.json';

export interface UpdatePackageVersionsFileOptions {
  readonly packageName: string;
  readonly version: string;
  readonly cwd: string;
}

export async function updatePackageVersionsFile({
  packageName,
  version,
  cwd,
}: UpdatePackageVersionsFileOptions): Promise<void> {
  await writeJsonFileSafe(join(cwd, PACKAGE_VERSIONS_FILE), {
    ...(await readJsonFile(join(cwd, PACKAGE_VERSIONS_FILE))),
    [packageName]: version,
  });
}
