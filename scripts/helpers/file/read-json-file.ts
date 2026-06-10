import { readFile } from 'node:fs/promises';
import type { ExplicitAny } from '../types/explicit-any.ts';
import { readTextFile } from './read-text-file.ts';

export type ReadJsonFileArguments =
  Parameters<typeof readFile> extends [infer GPath, ...infer GRest] ? [GPath, ...GRest] : never;

export async function readJsonFile<GValue = ExplicitAny>(
  ...args: ReadJsonFileArguments
): Promise<GValue> {
  return JSON.parse(await readTextFile(args[0], args[1]));
}
