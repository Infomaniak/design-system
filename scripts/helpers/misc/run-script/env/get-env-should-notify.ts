import { getBooleanEnvVariable } from '../../../env/types/get-boolean-env-variable.ts';

export const ENV_SHOULD_NOTIFY = 'SHOULD_NOTIFY';

export function getEnvShouldNotify(): boolean {
  return getBooleanEnvVariable(ENV_SHOULD_NOTIFY, true);
}
