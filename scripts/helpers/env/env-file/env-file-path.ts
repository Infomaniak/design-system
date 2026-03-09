import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ENV_FILE_PATH: string = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../..',
  '.env',
);
