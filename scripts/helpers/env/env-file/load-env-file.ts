import process from 'node:process';
import { ENV_FILE_PATH } from './env-file-path.ts';

export function loadEnvFile(): void {
  process.loadEnvFile(ENV_FILE_PATH);
}
