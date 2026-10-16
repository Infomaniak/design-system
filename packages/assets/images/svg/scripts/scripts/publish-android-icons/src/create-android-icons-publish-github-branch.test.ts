import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GitChanges } from '../../../../../../../../scripts/helpers/git/git-changes.ts';
import type {
  UpdateGitRepositoryOnNewBranchOptions,
  UpdateGitRepositoryOnNewBranchUpdateFunctionContext,
} from '../../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { updateGitRepositoryOnNewBranch } from '../../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { formatKotlinFiles } from '../../../../../../../../scripts/helpers/kotlin/format-kotlin-files.ts';
import { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { ANDROID_IMAGE_VECTORS_DESTINATION_PATH } from '../../../shared/android-icons/android-icons-config.ts';
import { createAndroidIconsPublishGithubBranch } from './create-android-icons-publish-github-branch.ts';

vi.mock('../../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts');
vi.mock('../../../../../../../../scripts/helpers/kotlin/format-kotlin-files.ts');

const logger = Logger.never();

const updateGitRepositoryOnNewBranchMock = vi.mocked(updateGitRepositoryOnNewBranch);
const formatKotlinFilesMock = vi.mocked(formatKotlinFiles);

const CHANGES: GitChanges = [{ mode: 'create', file: 'Icons/src/commonMain/kotlin/Check.kt' }];

describe('createAndroidIconsPublishGithubBranch', () => {
  let tempDir: string;
  let imageVectorsDirectory: string;
  let repositoryDirectory: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'android-icons-publish-'));
    imageVectorsDirectory = join(tempDir, 'kt');
    repositoryDirectory = join(tempDir, 'repository');
    await mkdir(imageVectorsDirectory, { recursive: true });
    await mkdir(repositoryDirectory, { recursive: true });
    await writeFile(join(imageVectorsDirectory, 'Check.kt'), 'val check = 1', 'utf8');
    await writeFile(
      join(repositoryDirectory, 'package-versions.json'),
      JSON.stringify({ 'other-package': '9.9.9' }),
      'utf8',
    );

    updateGitRepositoryOnNewBranchMock.mockImplementation(
      async (options: UpdateGitRepositoryOnNewBranchOptions): Promise<GitChanges> => {
        const context: UpdateGitRepositoryOnNewBranchUpdateFunctionContext = {
          repository: options.repository,
          branchName: options.branchName,
          cwd: repositoryDirectory,
          logger,
        };

        await writeFile(join(tempDir, 'commit-message.txt'), await options.update(context));

        return CHANGES;
      },
    );
  });

  afterEach(async () => {
    updateGitRepositoryOnNewBranchMock.mockReset();
    formatKotlinFilesMock.mockReset();
    await rm(tempDir, { force: true, recursive: true });
  });

  const createBranch = (): Promise<GitChanges> => {
    return createAndroidIconsPublishGithubBranch({
      logger,
      imageVectorsDirectory,
      packageName: '@infomaniak-design-system/svg-assets',
      version: '1.2.3',
      branchName: 'esds/icons/1.2.3',
    });
  };

  it('targets the Android repository on the given branch', async () => {
    expect(await createBranch()).toBe(CHANGES);

    const options: UpdateGitRepositoryOnNewBranchOptions =
      updateGitRepositoryOnNewBranchMock.mock.calls[0]![0]!;
    expect(options.repository).toBe(
      'git@android-design-system:Infomaniak/android-design-system.git',
    );
    expect(options.branchName).toBe('esds/icons/1.2.3');
    expect(options.allowEmpty).toBe('yes-skip-push');
    expect(await readFile(join(tempDir, 'commit-message.txt'), 'utf8')).toBe(
      'chore: @infomaniak-design-system/svg-assets@1.2.3',
    );
  });

  it('replaces the imagevector directory, records the version and formats Kotlin', async () => {
    const destinationDirectory: string = join(
      repositoryDirectory,
      ANDROID_IMAGE_VECTORS_DESTINATION_PATH,
    );
    await mkdir(destinationDirectory, { recursive: true });
    await writeFile(join(destinationDirectory, 'Removed.kt'), 'stale', 'utf8');

    await createBranch();

    expect(ANDROID_IMAGE_VECTORS_DESTINATION_PATH).toBe(
      'Icons/src/commonMain/kotlin/com/infomaniak/designsystem/icons/imagevector',
    );
    expect(await readdir(destinationDirectory)).toEqual(['Check.kt']);
    expect(
      JSON.parse(await readFile(join(repositoryDirectory, 'package-versions.json'), 'utf8')),
    ).toEqual({ 'other-package': '9.9.9', '@infomaniak-design-system/svg-assets': '1.2.3' });
    expect(formatKotlinFilesMock).toHaveBeenCalledExactlyOnceWith({
      cwd: repositoryDirectory,
      logger,
    });
  });
});
