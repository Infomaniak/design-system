import { getBooleanEnvVariable } from '../../../env/types/get-boolean-env-variable.ts';

export const ENV_IS_SUB_SCRIPT = 'IS_SUB_SCRIPT';

export function getEnvIsSubScript(): boolean {
  return getBooleanEnvVariable(ENV_IS_SUB_SCRIPT, false);
}
