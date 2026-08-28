import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_GITLAB_FONTS_TRIGGER_URL = 'GITLAB_FONTS_TRIGGER_URL';

export function getEnvGitlabFontsTriggerUrl(): string {
  return getEnvVariable(ENV_GITLAB_FONTS_TRIGGER_URL);
}
