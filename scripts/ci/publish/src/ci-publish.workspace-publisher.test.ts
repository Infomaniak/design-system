import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Logger } from '../../../helpers/log/logger.ts';

vi.mock('../../../helpers/misc/exec-command.ts', () => {
  return {
    execCommand: vi.fn(),
    execCommandInherit: vi.fn(async () => ''),
  };
});

import { execCommandInherit } from '../../../helpers/misc/exec-command.ts';
import { createWorkspacePublisher } from './ci-publish.ts';

const logger = Logger.root();

describe('createWorkspacePublisher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('injects computed prerelease dependency overrides into publish env', async () => {
    const publishWorkspacePackage = createWorkspacePublisher({
      logger,
      rootDirectory: '/repo',
    });

    await publishWorkspacePackage('@scope/a', {
      internalDependencyVersionOverrides: {
        '@scope/a': '1.0.0-dev.1700000000000',
        '@scope/b': '2.0.0-dev.1700000000000',
      },
      tag: 'dev',
      version: '1.0.0-dev.1700000000000',
    });

    expect(execCommandInherit).toHaveBeenCalledWith(
      logger,
      'yarn',
      ['workspace', '@scope/a', 'run', 'publish:ci'],
      expect.objectContaining({
        cwd: '/repo',
        shell: true,
        env: expect.objectContaining({
          NPM_DIST_TAG: 'dev',
          NPM_PUBLISH_VERSION: '1.0.0-dev.1700000000000',
          NPM_INTERNAL_DEP_OVERRIDES_JSON: JSON.stringify({
            '@scope/a': '1.0.0-dev.1700000000000',
            '@scope/b': '2.0.0-dev.1700000000000',
          }),
        }),
      }),
    );
  });
});
