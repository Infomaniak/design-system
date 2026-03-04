import { getJsonEnvVariable } from '../../../env/types/get-json-env-variable.ts';
import { buildConfigSchema } from '../build-config.schema.ts';
import type { BuildConfig } from '../build-config.ts';

export const ENV_BUILD_CONFIG = 'BUILD_CONFIG';

export function getEnvBuildConfig(): BuildConfig {
  return getJsonEnvVariable<BuildConfig>(ENV_BUILD_CONFIG, {
    defaultValue: {
      mode: 'prod',
    },
    schema: buildConfigSchema,
  });
}
