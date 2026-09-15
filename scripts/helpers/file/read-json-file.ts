import type { PathLike, ReadFileOptionsWithStringEncoding } from 'node:fs';
import { type FileHandle } from 'node:fs/promises';
import type { ExplicitAny } from '../types/explicit-any.ts';
import { readTextFile } from './read-text-file.ts';

export async function readJsonFile<GValue = ExplicitAny>(
  path: PathLike | FileHandle,
  options?: ReadFileOptionsWithStringEncoding,
): Promise<GValue> {
  return JSON.parse(await readTextFile(path, options));
}
