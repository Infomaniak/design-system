import { cp } from 'node:fs/promises';
import { basename, isAbsolute, join, relative } from 'node:path';
import { deleteGitRemoteBranch } from '../../../../../../../../../scripts/helpers/git/delete-git-remote-branch.ts';
import type { GitCommitChange } from '../../../../../../../../../scripts/helpers/git/git-commit.ts';
import { isGitSupported } from '../../../../../../../../../scripts/helpers/git/is-git-supported.ts';
import {
  updateGitRepositoryOnNewBranch,
  type UpdateGitRepositoryOnNewBranchUpdateFunctionContext,
} from '../../../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { DESIGN_SYSTEM_REPOSITORY_NAME } from '../../../../../../../../../scripts/helpers/github/constants/design-system-repository-name.constant.ts';
import { INFOMANIAK_DESIGN_SYSTEM_REPOSITORY } from '../../../../../../../../../scripts/helpers/github/constants/infomaniak-design-system-repository.constant.ts';
import { INFOMANIAK_GITHUB_ORGANIZATION } from '../../../../../../../../../scripts/helpers/github/constants/infomaniak-github-organization.constant.ts';
import type { GithubCiPullRequest } from '../../../../../../../../../scripts/helpers/github/github-ci-config/github-ci-config.ts';
import { createGithubPullRequest } from '../../../../../../../../../scripts/helpers/github/pull-request/create-github-pull-request.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { iteratorJoin } from '../../../../../../../../../scripts/helpers/misc/iterator/iterator-join.ts';
import { mapGetOrInsertComputed } from '../../../../../../../../../scripts/helpers/misc/map/upsert.ts';
import { dedent } from '../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';

export interface CreateImportSvgPullRequestsOptions {
  readonly outputDirectory: string;
  readonly packageRootDirectory: string;
  readonly workspaceRootDirectory: string;
  readonly version: string;
  readonly updateRepositoryAndCreatePullRequestAuthToken: string;
  readonly logger: Logger;
}

export function createImportSvgPullRequests({
  outputDirectory,
  packageRootDirectory,
  workspaceRootDirectory,
  version,
  updateRepositoryAndCreatePullRequestAuthToken,
  logger,
}: CreateImportSvgPullRequestsOptions): Promise<GithubCiPullRequest> {
  return logger.asyncTask('pr', async (): Promise<GithubCiPullRequest> => {
    if (!(await isGitSupported())) {
      throw new Error('git command not available.');
    }

    const branchName: string = `feat/import-icons--${version}`;
    const message: string = `feat(assets/svg): update icons - ${version}`;

    const changes: readonly GitCommitChange[] = await logger.asyncTask(
      'create-branch',
      (logger: Logger): Promise<readonly GitCommitChange[]> => {
        return updateGitRepositoryOnNewBranch({
          repository: INFOMANIAK_DESIGN_SYSTEM_REPOSITORY,
          accessToken: updateRepositoryAndCreatePullRequestAuthToken,
          branchName,
          update: async ({
            cwd,
          }: UpdateGitRepositoryOnNewBranchUpdateFunctionContext): Promise<string> => {
            const packageRootDirectoryRelativeToWorkspaceRootDirectory: string = isAbsolute(
              packageRootDirectory,
            )
              ? relative(workspaceRootDirectory, packageRootDirectory)
              : packageRootDirectory;

            const targetDirectory: string = join(
              cwd,
              packageRootDirectoryRelativeToWorkspaceRootDirectory,
            );

            await Promise.all([
              cp(outputDirectory, targetDirectory, {
                recursive: true,
                force: true,
              }),
            ]);

            // TODO: test and remove if not needed
            // await Promise.all([
            //   cp(join(outputDirectory, 'assets'), join(targetDirectory, 'assets'), {
            //     recursive: true,
            //     force: true,
            //   }),
            //   cp(join(outputDirectory, 'package.json'), join(targetDirectory, 'package.json'), {
            //     force: true,
            //   }),
            // ]);

            return message;
          },
          logger,
        });
      },
    );

    try {
      return await logger.asyncTask('create-pull-request', (): Promise<GithubCiPullRequest> => {
        return createGithubPullRequest({
          owner: INFOMANIAK_GITHUB_ORGANIZATION,
          repository: DESIGN_SYSTEM_REPOSITORY_NAME,
          authToken: updateRepositoryAndCreatePullRequestAuthToken,
          title: message,
          body: generateSvgPullRequestDescription({
            changes,
            version,
          }),
          head: branchName,
          base: 'main',
        });
      });
    } catch (error: unknown) {
      await logger.asyncTask('delete-branch-on-error', (logger: Logger): Promise<void> => {
        return deleteGitRemoteBranch({
          branchName,
          logger,
        });
      });
      throw error;
    }
  });
}

/*---*/

interface GenerateSvgPullRequestDescriptionOptions {
  readonly changes: readonly GitCommitChange[];
  readonly version: string;
}

function generateSvgPullRequestDescription({
  changes,
  version,
}: GenerateSvgPullRequestDescriptionOptions): string {
  type IconChangeType = 'svg' | 'metadata';
  const iconsThatChanged: Map<
    string /* icon name */,
    Map<IconChangeType, GitCommitChange['mode']>
  > = new Map();

  for (const { mode, file } of changes) {
    let type: IconChangeType;
    let name: string;

    if (file.endsWith('.svg')) {
      type = 'svg';
      name = basename(file, '.svg');
    } else if (file.endsWith('.metadata.json')) {
      type = 'metadata';
      name = basename(file, '.metadata.json');
    } else {
      continue;
    }

    mapGetOrInsertComputed(iconsThatChanged, name, () => new Map()).set(type, mode);
  }

  return dedent`
    ## Import Icons and Illustrations
    
    - version: ${version}
    - changes:

      ${iteratorJoin(
        iconsThatChanged.entries().map(([name, types]): string => {
          const resume: string = iteratorJoin(
            types.entries().map(([type, mode]): string => {
              return `${type} -> ${mode}`;
            }),
            ', ',
          );

          return dedent`
            - \`${name}\`: ${resume}
          `;
        }),
        '\n',
      )}
  `;
}
