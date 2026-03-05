import { getJsonEnvVariable } from '../../../env/types/get-json-env-variable.ts';
import { publishConfigSchema } from '../publish-config.schema.ts';
import type { PublishConfig } from '../publish-config.ts';

export const ENV_PUBLISH_CONFIG = 'PUBLISH_CONFIG';

export function getEnvPublishConfig(): PublishConfig {
  return getJsonEnvVariable<PublishConfig>(ENV_PUBLISH_CONFIG, {
    defaultValue: {
      mode: 'prod',
    },
    schema: publishConfigSchema,
  });
}
