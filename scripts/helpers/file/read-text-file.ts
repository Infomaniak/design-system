import { readFile } from 'node:fs/promises';

export type ReadTextFileArguments =
  Parameters<typeof readFile> extends [infer GPath, ...infer GRest] ? [GPath, ...GRest] : never;

export function readTextFile(...args: ReadTextFileArguments): Promise<string> {
  return readFile(args[0], {
    ...(typeof args[1] === 'object' ? args[1] : {}),
    encoding: 'utf-8',
  });
}
