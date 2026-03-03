import { getJsonEnvVariable } from '../../../env/get-json-env-variable.ts';
import type { BuildConfig } from '../build-config.ts';
import { publishConfigSchema } from '../publish-config.schema.ts';

export function getEnvBuildConfig(): BuildConfig {
  return getJsonEnvVariable<BuildConfig>('BUILD_CONFIG', {
    defaultValue: {
      mode: 'prod',
    },
    schema: publishConfigSchema,
  });
}
