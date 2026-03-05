import { getBooleanEnvVariable } from '../../env/types/get-boolean-env-variable.ts';

export const ENV_CI_PUBLISH_DRY_RUN = 'CI_PUBLISH_DRY_RUN';

export function getEnvCiPublishDryRun(): boolean {
  return getBooleanEnvVariable(ENV_CI_PUBLISH_DRY_RUN, false);
}
