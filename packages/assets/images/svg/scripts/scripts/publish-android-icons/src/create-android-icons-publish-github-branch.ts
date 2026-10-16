import { cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { GitChanges } from '../../../../../../../../scripts/helpers/git/git-changes.ts';
import {
  updateGitRepositoryOnNewBranch,
  type UpdateGitRepositoryOnNewBranchUpdateFunctionContext,
} from '../../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { ANDROID_DESIGN_SYSTEM_REPOSITORY_NAME } from '../../../../../../../../scripts/helpers/github/constants/android-design-system-repository-name.constant.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import { formatKotlinFiles } from '../../../../../../../../scripts/helpers/kotlin/format-kotlin-files.ts';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { UPDATE_PACKAGE_VERSIONS_FILE_CHANGES_HOOK } from '../../../../../../../../scripts/helpers/publish/update-package-versions-file/update-package-versions-file-changes-hook.ts';
import { updatePackageVersionsFile } from '../../../../../../../../scripts/helpers/publish/update-package-versions-file/update-package-versions-file.ts';
import { ANDROID_IMAGE_VECTORS_DESTINATION_PATH } from '../../../shared/android-icons/android-icons-config.ts';

export interface CreateAndroidIconsPublishGithubBranchOptions {
  readonly logger: Logger;
  /** Directory of the generated `<IconName>.kt` files to copy into the Android repository. */
  readonly imageVectorsDirectory: string;
  readonly packageName: string;
  readonly version: string;
  readonly branchName: string;
}

/**
 * Creates a new branch with the generated ImageVectors and pushes it to the remote Android
 * repository.
 */
export function createAndroidIconsPublishGithubBranch({
  logger,
  imageVectorsDirectory,
  packageName,
  version,
  branchName,
}: CreateAndroidIconsPublishGithubBranchOptions): Promise<GitChanges> {
  return updateGitRepositoryOnNewBranch({
    repository: `git@${ANDROID_DESIGN_SYSTEM_REPOSITORY_NAME}:${INFOMANIAK_GITHUB_ORGANIZATION}/${ANDROID_DESIGN_SYSTEM_REPOSITORY_NAME}.git`,
    branchName,
    update: async ({
      cwd,
    }: UpdateGitRepositoryOnNewBranchUpdateFunctionContext): Promise<string> => {
      const destinationDirectory: string = join(cwd, ANDROID_IMAGE_VECTORS_DESTINATION_PATH);

      // Replace the whole directory so removed icons are not kept stale on the Android side.
      await rm(destinationDirectory, { recursive: true, force: true });

      await Promise.all([
        cp(imageVectorsDirectory, destinationDirectory, { recursive: true, force: true }),
        updatePackageVersionsFile({
          packageName,
          version,
          cwd,
        }),
      ]);

      await formatKotlinFiles({ cwd, logger });

      return `chore: ${packageName}@${version}`;
    },
    changesHook: UPDATE_PACKAGE_VERSIONS_FILE_CHANGES_HOOK,
    logger,
    allowEmpty: 'yes-skip-push',
  });
}
