import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import type { Logger } from '../log/logger.ts';

export const ENV_FILE_PATH: string = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../..',
  '.env',
);

export function loadEnvFile(): void {
  process.loadEnvFile(ENV_FILE_PATH);
}

export function loadOptionallyEnvFile(logger: Logger): void {
  try {
    loadEnvFile();
  } catch {
    logger.warn('.env file not found.');
  }
}
