import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const ENV_FILE_PATH: string = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../..',
  '.env',
);

export function loadEnvFile(): void {
  process.loadEnvFile(ENV_FILE_PATH);
}
