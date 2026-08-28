import { afterEach, describe, expect, it } from 'vitest';
import {
  ENV_GITLAB_FONTS_TRIGGER_TOKEN,
  getEnvGitlabFontsTriggerToken,
} from './get-env-gitlab-fonts-trigger-token.ts';

afterEach(() => {
  delete process.env[ENV_GITLAB_FONTS_TRIGGER_TOKEN];
});

describe('getEnvGitlabFontsTriggerToken', () => {
  it('returns the value when the env variable is set', () => {
    process.env[ENV_GITLAB_FONTS_TRIGGER_TOKEN] = 'token-value';
    expect(getEnvGitlabFontsTriggerToken()).toBe('token-value');
  });

  it('throws when the env variable is missing', () => {
    delete process.env[ENV_GITLAB_FONTS_TRIGGER_TOKEN];
    expect(() => getEnvGitlabFontsTriggerToken()).toThrow(
      `Missing .env variable "${ENV_GITLAB_FONTS_TRIGGER_TOKEN}"`,
    );
  });
});
