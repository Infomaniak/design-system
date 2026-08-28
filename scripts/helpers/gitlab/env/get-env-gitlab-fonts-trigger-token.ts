import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_GITLAB_FONTS_TRIGGER_TOKEN = 'GITLAB_FONTS_TRIGGER_TOKEN';

export function getEnvGitlabFontsTriggerToken(): string {
  return getEnvVariable(ENV_GITLAB_FONTS_TRIGGER_TOKEN);
}
