import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_GITLAB_FONTS_TRIGGER_REF = 'GITLAB_FONTS_TRIGGER_REF';

export function getEnvGitlabFontsTriggerRef(): string {
  return getEnvVariable(ENV_GITLAB_FONTS_TRIGGER_REF);
}
