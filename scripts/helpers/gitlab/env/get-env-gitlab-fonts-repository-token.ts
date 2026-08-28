import { getEnvVariable } from '../../env/get-env-variable.ts';

export const ENV_GITLAB_FONTS_REPOSITORY_TOKEN = 'GITLAB_FONTS_REPOSITORY_TOKEN';

export function getEnvGitlabFontsRepositoryToken(): string {
  return getEnvVariable(ENV_GITLAB_FONTS_REPOSITORY_TOKEN);
}
