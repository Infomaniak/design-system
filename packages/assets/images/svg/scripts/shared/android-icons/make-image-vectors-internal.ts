import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { readTextFile } from '../../../../../../../scripts/helpers/file/read-text-file.ts';
import { writeTextFileSafe } from '../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { ANDROID_ICON_PACK_NAME } from './android-icons-config.ts';

const KOTLIN_FILE_EXTENSION = '.kt';

/** Valkyrie emits `public val` because of `--explicit-mode=true`, and has no visibility option. */
const PUBLIC_IMAGE_VECTOR_PATTERN: RegExp = new RegExp(
  `^public (val ${ANDROID_ICON_PACK_NAME}\\.\\w+\\.\\w+: ImageVector)$`,
  'm',
);

/** Makes the `EsdsIcons.<Size>.<IconName>` ImageVector of every Kotlin file of the directory `internal`. */
export async function makeImageVectorsInternalInDirectory(directory: string): Promise<void> {
  const fileNames: readonly string[] = (await readdir(directory)).filter(
    (fileName: string): boolean => fileName.endsWith(KOTLIN_FILE_EXTENSION),
  );

  await Promise.all(
    fileNames.map(async (fileName: string): Promise<void> => {
      const filePath: string = join(directory, fileName);

      await writeTextFileSafe(filePath, makeImageVectorInternal(await readTextFile(filePath)));
    }),
  );
}

export function makeImageVectorInternal(source: string): string {
  if (!PUBLIC_IMAGE_VECTOR_PATTERN.test(source)) {
    throw new Error('Expected the Kotlin source to declare a public ImageVector property.');
  }

  return source.replace(PUBLIC_IMAGE_VECTOR_PATTERN, 'internal $1');
}
