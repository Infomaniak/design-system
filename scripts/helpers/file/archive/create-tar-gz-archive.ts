import { execFile } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export interface CreateTarGzArchiveOptions {
  readonly sourceDirectory: string;
  readonly fileNames: readonly string[];
  readonly archiveName?: string;
  readonly outputDirectory?: string;
}

export async function createTarGzArchive({
  sourceDirectory,
  fileNames,
  archiveName = 'archive.tar.gz',
  outputDirectory,
}: CreateTarGzArchiveOptions): Promise<string> {
  const resolvedOutputDirectory: string =
    outputDirectory ?? (await mkdtemp(join(tmpdir(), 'tar-gz-archive-')));
  const archivePath: string = join(resolvedOutputDirectory, archiveName);

  await new Promise<void>((resolve, reject): void => {
    execFile(
      'tar',
      ['-czf', archivePath, '-C', sourceDirectory, ...fileNames],
      (error, _stdout, stderr) => {
        if (error !== null) {
          const errorDetails: string = [error.message, stderr.trim()].filter(Boolean).join(' — ');
          reject(new Error(`Failed to create tar.gz archive "${archivePath}": ${errorDetails}`));
          return;
        }

        resolve();
      },
    );
  });

  return archivePath;
}
