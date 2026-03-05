import { isAbsolute } from 'pathe';

export function verifyAbsolute(path: string): void {
  if (!isAbsolute(path)) {
    throw new Error(`Path must be absolute: ${path}`);
  }
}
