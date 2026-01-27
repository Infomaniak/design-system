import { writeFile } from 'node:fs/promises';
import { writeFileSafe } from './write-file-safe.ts';

export type WriteJsonFileSafeArguments =
  Parameters<typeof writeFile> extends [infer GPath, any, ...infer GRest]
    ? [GPath, any, ...GRest]
    : never;

export async function writeJsonFileSafe(...args: WriteJsonFileSafeArguments): Promise<void> {
  await writeFileSafe(args[0], JSON.stringify(args[1], null, 2), {
    ...(typeof args[2] === 'object' ? args[2] : {}),
    encoding: 'utf-8',
  });
}
