import { afterEach, describe, expect, it } from 'vitest';
import {
  ENV_GITLAB_FONTS_TRIGGER_REF,
  getEnvGitlabFontsTriggerRef,
} from './get-env-gitlab-fonts-trigger-ref.ts';

afterEach(() => {
  delete process.env[ENV_GITLAB_FONTS_TRIGGER_REF];
});

describe('getEnvGitlabFontsTriggerRef', () => {
  it('returns the value when the env variable is set', () => {
    process.env[ENV_GITLAB_FONTS_TRIGGER_REF] = 'develop';
    expect(getEnvGitlabFontsTriggerRef()).toBe('develop');
  });

  it('throws when the env variable is missing', () => {
    delete process.env[ENV_GITLAB_FONTS_TRIGGER_REF];
    expect(() => getEnvGitlabFontsTriggerRef()).toThrow(
      `Missing .env variable "${ENV_GITLAB_FONTS_TRIGGER_REF}"`,
    );
  });
});
