import type { PathLike, ReadFileOptionsWithStringEncoding } from 'node:fs';
import { type FileHandle, readFile } from 'node:fs/promises';

export function readTextFile(
  path: PathLike | FileHandle,
  options?: ReadFileOptionsWithStringEncoding,
): Promise<string> {
  return readFile(path, {
    ...(typeof options === 'object' ? options : {}),
    encoding: 'utf-8',
  });
}
