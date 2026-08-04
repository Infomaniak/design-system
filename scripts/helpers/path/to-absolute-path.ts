import { isAbsolute, resolve } from 'node:path';
import process from 'node:process';

export function toAbsolutePath(path: string, cwd: string = process.cwd()): string {
  return isAbsolute(path) ? path : resolve(cwd, path);
}
