import { rename, unlink } from 'node:fs/promises';

import { writeTextFileSafe } from './write-text-file-safe.ts';

export async function writeTextFileAtomic(filePath: string, content: string): Promise<void> {
  const temporaryFilePath: string = `${filePath}.tmp`;

  try {
    await writeTextFileSafe(temporaryFilePath, content);
    await rename(temporaryFilePath, filePath);
  } catch (error: unknown) {
    await unlink(temporaryFilePath).catch((): void => undefined);

    throw error;
  }
}
