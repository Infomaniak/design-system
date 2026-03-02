import { writeFile } from 'node:fs/promises';
import type { ExplicitAny } from '../types/explicit-any.ts';
import { writeTextFileSafe } from './write-text-file-safe.ts';

export type WriteJsonFileSafeArguments =
  Parameters<typeof writeFile> extends [infer GPath, ExplicitAny, ...infer GRest]
    ? [GPath, ExplicitAny, ...GRest]
    : never;

export async function writeJsonFileSafe(...args: WriteJsonFileSafeArguments): Promise<void> {
  await writeTextFileSafe(args[0], JSON.stringify(args[1], null, 2), args[2]);
}
