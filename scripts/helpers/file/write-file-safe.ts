import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function writeFileSafe(...args: Parameters<typeof writeFile>): Promise<void> {
  if (typeof args[0] !== 'string') {
    throw new TypeError('Only string path are supported.');
  }
  await mkdir(dirname(args[0] as string), { recursive: true });
  await writeFile(...args);
}
