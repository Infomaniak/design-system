import { readFile } from 'node:fs/promises';

export type ReadJsonFileArguments =
  Parameters<typeof readFile> extends [infer GPath, ...infer GRest] ? [GPath, ...GRest] : never;

export async function readJsonFile(...args: ReadJsonFileArguments): Promise<any> {
  return JSON.parse(
    (await readFile(args[0], {
      ...(typeof args[1] === 'object' ? args[1] : {}),
      encoding: 'utf-8',
    })) as unknown as string,
  );
}
