import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Logger } from '../../../helpers/log/logger.ts';
import { execCommandInherit } from '../../../helpers/misc/exec-command.ts';
import { isNpmPackagePublished } from '../../../helpers/npm/is-npm-version-published/is-npm-package-published.ts';
import type { PackageJsonWithPath } from '../../../helpers/publish/discover/discover-package-json-files.ts';
import { getImpactedPackageJsonFiles } from '../../../helpers/publish/discover/get-impacted-package-json-files.ts';
import { ENV_PUBLISH_CONFIG } from '../../../helpers/publish/publish-config/env/get-env-publish-config.ts';
import { ciPublish } from './ci-publish.ts';

vi.mock('../../../helpers/misc/exec-command.ts');
vi.mock('../../../helpers/npm/is-npm-version-published/is-npm-package-published.ts');
vi.mock('../../../helpers/publish/discover/get-impacted-package-json-files.ts');

const execCommandInheritMock = vi.mocked(execCommandInherit);
const getImpactedPackageJsonFilesMock = vi.mocked(getImpactedPackageJsonFiles);
const isNpmPackagePublishedMock = vi.mocked(isNpmPackagePublished);

describe('ciPublish', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(123);
    execCommandInheritMock.mockReset();
    execCommandInheritMock.mockResolvedValue('');
    getImpactedPackageJsonFilesMock.mockReset();
    isNpmPackagePublishedMock.mockReset();
    isNpmPackagePublishedMock.mockResolvedValue(false);
  });

  it('publishes symbols before tokens when tokens depend on the symbols branch', async () => {
    const packages: readonly PackageJsonWithPath[] = [
      [
        '/repository/packages/tokens/package.json',
        { name: '@infomaniak-design-system/tokens', version: '1.2.3' },
      ],
      [
        '/repository/packages/assets/images/svg/package.json',
        { name: '@infomaniak-design-system/svg-assets', version: '4.5.6' },
      ],
    ];
    getImpactedPackageJsonFilesMock.mockResolvedValue(packages);

    await ciPublish({
      rootDirectory: '/repository',
      dryRun: false,
      logger: Logger.never(),
      baseSha: 'base-sha',
      jobUrl: 'https://example.com/job',
      branchName: 'develop',
      mode: 'dev',
    });

    expect(execCommandInheritMock).toHaveBeenCalledTimes(3);
    expect(execCommandInheritMock.mock.calls[1]?.[2]).toEqual([
      'workspaces',
      'foreach',
      '--topological-dev',
      '--recursive',
      '--from',
      '@infomaniak-design-system/svg-assets',
      'run',
      'publish',
    ]);
    expect(execCommandInheritMock.mock.calls[2]?.[2]).toEqual([
      'workspaces',
      'foreach',
      '--topological-dev',
      '--recursive',
      '--from',
      '@infomaniak-design-system/tokens',
      'run',
      'publish',
    ]);

    const publishConfig = JSON.parse(
      execCommandInheritMock.mock.calls[2]?.[3]?.env?.[ENV_PUBLISH_CONFIG] as string,
    );
    expect(publishConfig).toEqual({
      mode: 'dev',
      prerelease: '123',
      baseBranch: 'esds-symbols/4.5.6-dev.123',
    });
  });
});
