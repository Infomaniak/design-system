import { getJsonEnvVariable } from '../../../env/get-json-env-variable.ts';
import { buildConfigSchema } from '../build-config.schema.ts';
import type { BuildConfig } from '../build-config.ts';

export function getEnvBuildConfig(): BuildConfig {
  return getJsonEnvVariable<BuildConfig>('BUILD_CONFIG', {
    defaultValue: {
      mode: 'prod',
    },
    schema: buildConfigSchema,
  });
}
