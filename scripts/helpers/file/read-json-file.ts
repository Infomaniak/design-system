import { readFile } from 'node:fs/promises';
import type { ExplicitAny } from '../types/explicit-any.ts';

export type ReadJsonFileArguments =
  Parameters<typeof readFile> extends [infer GPath, ...infer GRest] ? [GPath, ...GRest] : never;

export async function readJsonFile<GValue = ExplicitAny>(
  ...args: ReadJsonFileArguments
): Promise<GValue> {
  return JSON.parse(
    (await readFile(args[0], {
      ...(typeof args[1] === 'object' ? args[1] : {}),
      encoding: 'utf-8',
    })) as unknown as string,
  );
}
