import type { Logger } from '../../log/logger.ts';
import { getEnvIgnoreEnvFile } from './get-env-ignore-env-file.ts';
import { loadEnvFile } from './load-env-file.ts';

export function loadOptionallyEnvFile(logger: Logger): void {
  if (getEnvIgnoreEnvFile()) {
    logger.info('SKIP (non-blocking): .env file ignored.');
  } else {
    try {
      loadEnvFile();
    } catch {
      logger.info('SKIP (non-blocking): .env file not found.');
    }
  }
}
