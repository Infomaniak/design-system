import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_GITLAB_FONTS_REPOSITORY_URL = 'GITLAB_FONTS_REPOSITORY_URL';

export function getEnvGitlabFontsRepositoryUrl(): string {
  return getEnvVariable(ENV_GITLAB_FONTS_REPOSITORY_URL);
}
