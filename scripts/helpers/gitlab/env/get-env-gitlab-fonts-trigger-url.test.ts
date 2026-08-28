import { afterEach, describe, expect, it } from 'vitest';
import {
  ENV_GITLAB_FONTS_TRIGGER_URL,
  getEnvGitlabFontsTriggerUrl,
} from './get-env-gitlab-fonts-trigger-url.ts';

afterEach(() => {
  delete process.env[ENV_GITLAB_FONTS_TRIGGER_URL];
});

describe('getEnvGitlabFontsTriggerUrl', () => {
  it('returns the value when the env variable is set', () => {
    process.env[ENV_GITLAB_FONTS_TRIGGER_URL] = 'https://example.com/trigger';
    expect(getEnvGitlabFontsTriggerUrl()).toBe('https://example.com/trigger');
  });

  it('throws when the env variable is missing', () => {
    delete process.env[ENV_GITLAB_FONTS_TRIGGER_URL];
    expect(() => getEnvGitlabFontsTriggerUrl()).toThrow(
      `Missing .env variable "${ENV_GITLAB_FONTS_TRIGGER_URL}"`,
    );
  });
});
