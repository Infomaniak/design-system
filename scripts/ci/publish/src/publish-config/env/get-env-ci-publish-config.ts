import { getJsonEnvVariable } from '../../../../../helpers/env/get-json-env-variable.ts';
import { ciPublishConfigSchema } from '../ci-publish-config.schema.ts';
import type { CiPublishConfig } from '../ci-publish-config.ts';

export function getEnvCiPublishConfig(): CiPublishConfig {
  return getJsonEnvVariable<CiPublishConfig>('CI_PUBLISH_CONFIG', {
    schema: ciPublishConfigSchema,
  });
}
