import { getJsonEnvVariable } from '../../../env/get-json-env-variable.ts';
import type { GithubCiConfig } from '../github-ci-config.ts';

export function getEnvGithubCiConfig(): GithubCiConfig {
  return getJsonEnvVariable<GithubCiConfig>('GITHUB_CI_CONFIG');
}
