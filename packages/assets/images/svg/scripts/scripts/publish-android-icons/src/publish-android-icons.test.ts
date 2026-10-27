import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PackageJson } from '../../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import type { GitChanges } from '../../../../../../../../scripts/helpers/git/git-changes.ts';
import { deleteGithubObsoletePublishBranches } from '../../../../../../../../scripts/helpers/github/branch/delete-github-obsolete-publish-branches.ts';
import type { GithubCiPullRequest } from '../../../../../../../../scripts/helpers/github/github-ci-config/github-ci-config.ts';
import { createGithubPullRequest } from '../../../../../../../../scripts/helpers/github/pull-request/create-github-pull-request.ts';
import { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { createAndroidIconsPublishGithubBranch } from './create-android-icons-publish-github-branch.ts';
import { publishAndroidIcons, type PublishAndroidIconsOptions } from './publish-android-icons.ts';

vi.mock('./create-android-icons-publish-github-branch.ts');
vi.mock(
  '../../../../../../../../scripts/helpers/github/branch/delete-github-obsolete-publish-branches.ts',
);
vi.mock(
  '../../../../../../../../scripts/helpers/github/pull-request/create-github-pull-request.ts',
);
vi.mock('../../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts');

const logger = Logger.never();

const createAndroidIconsPublishGithubBranchMock = vi.mocked(createAndroidIconsPublishGithubBranch);
const createGithubPullRequestMock = vi.mocked(createGithubPullRequest);
const readPackageJsonFileMock = vi.mocked(readPackageJsonFile);
const deleteGithubObsoletePublishBranchesMock = vi.mocked(deleteGithubObsoletePublishBranches);

const IMAGE_VECTORS_DIRECTORY = '/svg-assets/dist/android/icons/kt';
const SYMBOLS_DIRECTORY = '/svg-assets/dist/android/icons/symbols';

describe('publishAndroidIcons', () => {
  beforeEach(() => {
    createAndroidIconsPublishGithubBranchMock.mockReset();
    createGithubPullRequestMock.mockReset();
    readPackageJsonFileMock.mockReset();
    deleteGithubObsoletePublishBranchesMock.mockReset();

    readPackageJsonFileMock.mockResolvedValue({ name: 'x', version: '1.2.3' } as PackageJson);
    createGithubPullRequestMock.mockResolvedValue({} as GithubCiPullRequest);
    vi.stubEnv('CI_PULL_REQUEST_AUTH_TOKEN_MOBILE', 'test-token');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const createPublishOptions = (mode: 'dev' | 'prod'): PublishAndroidIconsOptions => {
    return {
      ...(mode === 'dev' ? { mode, prerelease: '42' } : { mode }),
      packageRootDirectory: '/svg-assets',
      imageVectorsDirectory: IMAGE_VECTORS_DIRECTORY,
      symbolsDirectory: SYMBOLS_DIRECTORY,
      logger,
    };
  };

  const mockBranchChanges = (): void => {
    createAndroidIconsPublishGithubBranchMock.mockResolvedValue([
      { mode: 'create', file: 'Icons/src/commonMain/kotlin/Check.kt' },
    ] satisfies GitChanges);
  };

  it('pushes the branch and opens a pull request (dev mode)', async () => {
    mockBranchChanges();

    await publishAndroidIcons(createPublishOptions('dev'));

    expect(readPackageJsonFileMock).toHaveBeenCalledWith('/svg-assets/package.json');
    expect(createAndroidIconsPublishGithubBranchMock).toHaveBeenCalledWith({
      logger,
      imageVectorsDirectory: IMAGE_VECTORS_DIRECTORY,
      symbolsDirectory: SYMBOLS_DIRECTORY,
      packageName: 'x',
      version: '1.2.3-dev.42',
      branchName: 'esds/icons/1.2.3-dev.42',
    });
    expect(createGithubPullRequestMock).toHaveBeenCalledWith({
      owner: 'Infomaniak',
      repository: 'android-design-system',
      authToken: 'test-token',
      title: 'chore: x@1.2.3-dev.42',
      body: 'x@1.2.3-dev.42',
      head: 'esds/icons/1.2.3-dev.42',
      base: 'main',
    });
    expect(deleteGithubObsoletePublishBranchesMock).toHaveBeenCalledWith({
      owner: 'Infomaniak',
      repository: 'android-design-system',
      authToken: 'test-token',
      branchPrefix: 'esds/icons/',
      currentBranchName: 'esds/icons/1.2.3-dev.42',
      logger,
    });
  });

  it('uses the package version as-is in prod mode', async () => {
    mockBranchChanges();

    await publishAndroidIcons(createPublishOptions('prod'));

    expect(createAndroidIconsPublishGithubBranchMock).toHaveBeenCalledWith(
      expect.objectContaining({ version: '1.2.3', branchName: 'esds/icons/1.2.3' }),
    );
    expect(createGithubPullRequestMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'chore: x@1.2.3', head: 'esds/icons/1.2.3' }),
    );
  });

  it('skips the pull request when the pushed branch has no changes', async () => {
    createAndroidIconsPublishGithubBranchMock.mockResolvedValue([] satisfies GitChanges);

    await publishAndroidIcons(createPublishOptions('dev'));

    expect(createAndroidIconsPublishGithubBranchMock).toHaveBeenCalledOnce();
    expect(createGithubPullRequestMock).not.toHaveBeenCalled();
    expect(deleteGithubObsoletePublishBranchesMock).not.toHaveBeenCalled();
  });
});
