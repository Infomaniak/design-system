import { type Dir } from 'node:fs';
import { opendir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import process from 'node:process';

export interface ExploreDirectoryFilesOptions {
  readonly relativeTo?: string;
  readonly pick?: ExploreDirectoryFilesPickFunction;
}

export interface ExploreDirectoryFilesPickFunction {
  (path: string, type: ExploreDirectoryFilesEntryType): boolean;
}

export interface ExploreDirectoryFilesEntryType {
  readonly isFile: boolean;
  readonly isDirectory: boolean;
}

/**
 * Recursively explore a directory and yield all files.
 *
 * @param {string} path
 * @param {{relativeTo?: string; pick?: (path: string, type: { isFile: boolean; isDirectory: boolean; }) => boolean; }?} options
 * @returns {AsyncGenerator<string>} A generator that yields all files (path) in the directory.
 */
export async function* exploreDirectoryFiles(
  path: string,
  options?: ExploreDirectoryFilesOptions,
): AsyncGenerator<string> {
  const dir: Dir = await opendir(resolve(process.cwd(), path));

  for await (const dirent of dir) {
    const path = join(dirent.parentPath, dirent.name);
    const relativePath =
      options?.relativeTo === undefined ? path : relative(options.relativeTo, path);

    if (
      options?.pick?.(relativePath, {
        isFile: dirent.isFile(),
        isDirectory: dirent.isDirectory(),
      }) ??
      true
    ) {
      if (dirent.isFile()) {
        yield relativePath;
      } else if (dirent.isDirectory()) {
        yield* exploreDirectoryFiles(path, options);
      }
    }
  }
}
