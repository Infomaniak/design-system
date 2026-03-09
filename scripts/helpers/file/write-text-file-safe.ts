import { writeFile } from 'node:fs/promises';
import type { ExplicitAny } from '../types/explicit-any.ts';
import { writeFileSafe } from './write-file-safe.ts';

export type WriteTextFileSafeArguments =
  Parameters<typeof writeFile> extends [infer GPath, ExplicitAny, ...infer GRest]
    ? [GPath, string, ...GRest]
    : never;

export async function writeTextFileSafe(...args: WriteTextFileSafeArguments): Promise<void> {
  await writeFileSafe(args[0], args[1], {
    ...(typeof args[2] === 'object' ? args[2] : {}),
    encoding: 'utf-8',
  });
}
