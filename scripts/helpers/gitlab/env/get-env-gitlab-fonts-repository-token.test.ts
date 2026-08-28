import { afterEach, describe, expect, it } from 'vitest';
import {
  ENV_GITLAB_FONTS_REPOSITORY_TOKEN,
  getEnvGitlabFontsRepositoryToken,
} from './get-env-gitlab-fonts-repository-token.ts';

afterEach(() => {
  delete process.env[ENV_GITLAB_FONTS_REPOSITORY_TOKEN];
});

describe('getEnvGitlabFontsRepositoryToken', () => {
  it('returns the value when the env variable is set', () => {
    process.env[ENV_GITLAB_FONTS_REPOSITORY_TOKEN] = 'token-value';
    expect(getEnvGitlabFontsRepositoryToken()).toBe('token-value');
  });

  it('throws when the env variable is missing', () => {
    delete process.env[ENV_GITLAB_FONTS_REPOSITORY_TOKEN];
    expect(() => getEnvGitlabFontsRepositoryToken()).toThrow(
      `Missing .env variable "${ENV_GITLAB_FONTS_REPOSITORY_TOKEN}"`,
    );
  });
});
