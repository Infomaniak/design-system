import { isAbsolute } from 'node:path';

export function verifyAbsolute(path: string): void {
  if (!isAbsolute(path)) {
    throw new Error(`Path must be absolute: ${path}`);
  }
}
