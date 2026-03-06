import { getBooleanEnvVariable } from '../types/get-boolean-env-variable.ts';

export const ENV_IGNORE_ENV_FILE = 'IGNORE_ENV_FILE';

export function getEnvIgnoreEnvFile(): boolean {
  return getBooleanEnvVariable(ENV_IGNORE_ENV_FILE, false);
}
