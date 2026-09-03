import { afterEach, describe, expect, it } from 'vitest';
import {
  ENV_GITLAB_FONTS_REPOSITORY_URL,
  getEnvGitlabFontsRepositoryUrl,
} from './get-env-gitlab-fonts-repository-url.ts';

afterEach(() => {
  delete process.env[ENV_GITLAB_FONTS_REPOSITORY_URL];
});

describe('getEnvGitlabFontsRepositoryUrl', () => {
  it('returns the value when the env variable is set', () => {
    process.env[ENV_GITLAB_FONTS_REPOSITORY_URL] = 'https://example.com/fonts.git';
    expect(getEnvGitlabFontsRepositoryUrl()).toBe('https://example.com/fonts.git');
  });

  it('throws when the env variable is missing', () => {
    delete process.env[ENV_GITLAB_FONTS_REPOSITORY_URL];
    expect(() => getEnvGitlabFontsRepositoryUrl()).toThrow(
      `Missing .env variable "${ENV_GITLAB_FONTS_REPOSITORY_URL}"`,
    );
  });
});
