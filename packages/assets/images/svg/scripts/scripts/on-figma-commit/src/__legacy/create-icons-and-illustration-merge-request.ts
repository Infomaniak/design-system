import { randomUUID } from 'node:crypto';
import { basename } from 'node:path';
import { createGitlabMergeRequest } from '../../helpers/gitlab/create-gitlab-merge-request.ts';
import { getEnvGitlabDefaultBranch } from '../../helpers/gitlab/env/get-env-gitlab-default-branch.ts';
import { getEnvGitlabRepositoryUrlUsingGitlabAccessToken } from '../../helpers/gitlab/env/get-env-gitlab-repository-url-using-gitlab-access-token.ts';
import type { GitlabFileSearchEntry } from '../../helpers/gitlab/search-in-all-gitlab-files.ts';
import { searchSvgUsages } from '../../helpers/gitlab/search-svg-usages.ts';
import { Logger } from '../../helpers/log/logger.ts';
import {
  execCommand,
  ExecCommandError,
  execCommandInherit,
} from '../../helpers/misc/exec-command.ts';
import { indent } from '../../helpers/misc/indent.ts';
import { type ExpandedMergeRequestSchema } from '@gitbeaker/core';

export async function createIconsAndIllustrationMergeRequest(
  logger: Logger,
): Promise<ExpandedMergeRequestSchema> {
  if (!(await gitIsSupported())) {
    throw new Error('git command not available.');
  }

  const branchName: string = `feature/import-icons--${randomUUID()}`;

  logger.info(`Create GIT MR: "${branchName}"`);

  // https://stackoverflow.com/questions/57706047/how-to-execute-git-commands-in-gitlab-ci-scripts

  await gitSetUpGlobalConfig(logger);
  await gitCheckoutDefaultBranchAndCreateNewBranch(logger, branchName);

  let mr: ExpandedMergeRequestSchema;
  try {
    await gitAddAllFiles(logger);

    const commitResult: string = await gitCommit(logger, 'feat: modify icons');

    if (commitResult === '') {
      throw new Error('Nothing to commit.');
    }

    const description: string = await generateMRDescription(commitResult);

    await gitPush(logger, branchName);

    mr = await createGitlabMergeRequest({
      sourceBranch: branchName,
      title: branchName,
      description,
      removeSourceBranch: true,
    });
  } catch (error: unknown) {
    logger.error(error instanceof Error ? error.message : error);
    throw error;
  } finally {
    await gitCheckoutDefaultBranchAndDeleteCurrentBranch(logger, branchName);
  }

  logger.info('MR created with success.');

  return mr;
}

/* LOCAL FUNCTIONS */

/**
 * Checks if the "git" command is supported.
 */
async function gitIsSupported(): Promise<boolean> {
  try {
    await execCommand(Logger.NEVER, 'git', ['-v']);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if git has a global config.
 */
async function gitHasGlobalConfigUserName(logger: Logger): Promise<boolean> {
  try {
    const output: string = await execCommand(logger, 'git', ['config', '--global', 'user.name']);
    return output !== '';
  } catch {
    return false;
  }
}

/**
 * Init the global git config.
 */
async function gitSetUpGlobalConfig(logger: Logger): Promise<void> {
  // DOC: https://stackoverflow.com/questions/51716044/how-do-i-push-to-a-repo-from-within-a-gitlab-ci-pipeline

  if (!(await gitHasGlobalConfigUserName(Logger.NEVER))) {
    await execCommandInherit(logger, 'git', [
      'config',
      '--global',
      'user.name',
      'CI Pipeline',
      // getEnvGitlabUserName(),
    ]);
    await execCommandInherit(logger, 'git', [
      'config',
      '--global',
      'user.email',
      'ci@pipeline.com',
      // getEnvGitlabUserEmail(),
    ]);

    await execCommandInherit(logger, 'git', [
      'remote',
      'set-url',
      '--push',
      'origin',
      getEnvGitlabRepositoryUrlUsingGitlabAccessToken(),
    ]);
  }
}

/**
 * Checkouts the "default" branch to be sync with the origin, then creates a git branch.
 */
async function gitCheckoutDefaultBranchAndCreateNewBranch(
  logger: Logger,
  branchName: string,
): Promise<void> {
  // ensures we're sync with the origin's default branch
  await execCommandInherit(logger, 'git', ['checkout', getEnvGitlabDefaultBranch()]);
  await execCommandInherit(logger, 'git', ['pull']);
  // creates the new branch
  await execCommandInherit(logger, 'git', ['checkout', '-b', branchName, 'HEAD']);
}

/**
 * Adds all the files to git.
 */
async function gitAddAllFiles(logger: Logger): Promise<void> {
  await execCommandInherit(logger, 'git', ['add', '-A']);
}

/**
 * Commits changes with git.
 *
 * @return `true` if we have files to commit.
 */
async function gitCommit(logger: Logger, message: string): Promise<string> {
  try {
    return await execCommand(logger, 'git', ['commit', '-m', message]);
  } catch (error: unknown) {
    if (error instanceof ExecCommandError && error.stderr === '') {
      return '';
    }
    throw error;
  }
}

/**
 * Pushes changes to origin with git.
 */
async function gitPush(logger: Logger, branchName: string): Promise<void> {
  await execCommandInherit(logger, 'git', ['push', '--set-upstream', 'origin', branchName]);
}

/**
 * Checkouts the "default" branch and deletes the "current" branch.
 *
 * > Restores the initial state.
 */
async function gitCheckoutDefaultBranchAndDeleteCurrentBranch(
  logger: Logger,
  branchName: string,
): Promise<void> {
  await execCommandInherit(logger, 'git', ['checkout', getEnvGitlabDefaultBranch()]);
  await execCommandInherit(logger, 'git', ['branch', '-D', branchName]);
}

async function generateMRDescription(commitResult: string): Promise<string> {
  const commitLines: readonly string[] = commitResult.split('\n').map((line: string): string => {
    return line.trim();
  });

  const filesThatChanged: Set<string> = new Set<string>();

  for (const commitLine of commitLines) {
    const match: RegExpMatchArray | null = commitLine.match(/assets\/[\w\-\/\.]+$/);
    if (match !== null) {
      filesThatChanged.add(commitLine.slice(match.index));
    }
  }

  const svgFilesThatChanged: string[] = Array.from(filesThatChanged).filter(
    (path: string): boolean => {
      return path.endsWith('.svg');
    },
  );

  const updatedSVGDescription: readonly string[] =
    svgFilesThatChanged.length > 0
      ? [
          'New or updated svg:',
          '',
          ...(
            await Promise.all(
              svgFilesThatChanged.map(async (path: string): Promise<readonly string[]> => {
                const prefix: string = inferSVGPrefixFromPath(path);
                const name: string = basename(path, '.svg');
                const fullname: string = `${prefix}:${name}`;

                const impacts: GitlabFileSearchEntry[] = await searchSvgUsages(fullname);

                return [
                  `- \`${fullname}\`: (_${path}_): ${impacts.length === 0 ? 'no impact detected' : `${impacts.length} impact${impacts.length === 1 ? '' : 's'} detected`}`,
                  ...(impacts.length > 0
                    ? indent(
                        impacts.map((impact: GitlabFileSearchEntry): string => {
                          return `- ${impact.url!}#L${impact.startline + 2}`;
                        }),
                      )
                    : []),
                ];
              }),
            )
          ).flat(),
          '',
        ]
      : [];

  const metadataFilesThatChanged: string[] = Array.from(filesThatChanged).filter(
    (path: string): boolean => {
      return path.endsWith('.metadata.json');
    },
  );

  const updatedMetadataDescription: readonly string[] =
    metadataFilesThatChanged.length > 0
      ? [
          'New or updated metadata:',
          '',
          ...Array.from(metadataFilesThatChanged).map((name: string): string => {
            return `- \`${name}\``;
          }),
          '',
        ]
      : [];

  return [...updatedSVGDescription, ...updatedMetadataDescription].join('\n');
}

function inferSVGPrefixFromPath(path: string): string {
  if (path.startsWith('assets/svg/monotone/figma/')) {
    return 'ik';
  } else {
    throw new Error(`Unable to infer a prefix from the path: ${path}`);
  }
}
