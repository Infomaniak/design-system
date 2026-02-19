import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { getCliArgValue } from '../../helpers/ci/get-cli-arg-value.ts';
import { writeGithubOutput } from '../../helpers/ci/write-github-output.ts';
import { loadOptionallyEnvFile } from '../../helpers/env/load-env-file.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';
import {
  execCommand,
  ExecCommandError,
  execCommandInherit,
} from '../../helpers/misc/exec-command.ts';
import {
  createCleanupCommitMessage,
  isStorybookPrCleanupTargetDirectory,
} from './src/cleanup-storybook-pr.ts';
import { normalizeStorybookIframeHtml } from './src/normalize-storybook-html.ts';
import {
  resolveStorybookPagesContext,
  type StorybookPagesContext,
} from './src/storybook-pages-context.ts';

type StorybookPagesScriptMode = 'prepare' | 'postbuild' | 'cleanup-pr';
const GH_PAGES_JUNK_DIRECTORIES: readonly string[] = [
  '.yarn',
  'node_modules',
  'apps/doc/node_modules',
  'apps/docs/node_modules',
];

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

function getMode(): StorybookPagesScriptMode {
  const mode: string | undefined =
    getCliArgValue(process.argv, '--mode') ?? process.env['STORYBOOK_PAGES_MODE'];

  if (mode !== 'prepare' && mode !== 'postbuild' && mode !== 'cleanup-pr') {
    throw new Error(
      'Invalid mode. Expected --mode=prepare, --mode=postbuild or --mode=cleanup-pr.',
    );
  }

  return mode;
}

async function runPrepareMode(): Promise<void> {
  const eventName: string = process.env['GITHUB_EVENT_NAME'] ?? '';
  const ref: string = process.env['GITHUB_REF'] ?? '';
  const repository: string = process.env['GITHUB_REPOSITORY'] ?? '';
  const repositoryOwner: string = process.env['GITHUB_REPOSITORY_OWNER'] ?? '';

  const context: StorybookPagesContext =
    eventName === '' || ref === '' || repository === '' || repositoryOwner === ''
      ? { shouldDeploy: false }
      : resolveStorybookPagesContext({
          eventName,
          ref,
          repository,
          repositoryOwner,
        });

  await writeGithubOutput({ logger, name: 'should_deploy', value: String(context.shouldDeploy) });

  if (!context.shouldDeploy) {
    await writeGithubOutput({ logger, name: 'target', value: '' });
    await writeGithubOutput({ logger, name: 'destination_dir', value: '' });
    await writeGithubOutput({ logger, name: 'public_url', value: '' });
    await writeGithubOutput({ logger, name: 'environment_name', value: '' });
    logger.warn('Storybook pages deployment context not available for this event/ref.');
    return;
  }

  await writeGithubOutput({ logger, name: 'target', value: context.target });
  await writeGithubOutput({ logger, name: 'destination_dir', value: context.destinationDir });
  await writeGithubOutput({ logger, name: 'public_url', value: context.publicUrl });
  await writeGithubOutput({ logger, name: 'environment_name', value: context.environmentName });

  logger.info('Storybook pages context:', context);
}

async function runPostbuildMode(): Promise<void> {
  const distDir: string = process.env['STORYBOOK_DIST_DIR'] ?? 'apps/docs/storybook-static';
  const iframePath: string = join(distDir, 'iframe.html');

  const before: string = await readFile(iframePath, { encoding: 'utf8' });
  const after: string = normalizeStorybookIframeHtml(before);

  if (before === after) {
    logger.info(`No iframe normalization required: ${iframePath}`);
    return;
  }

  await writeFile(iframePath, after, { encoding: 'utf8' });
  logger.info(`Applied iframe normalization for subpath hosting: ${iframePath}`);
}

async function runCleanupPrMode(): Promise<void> {
  const pullRequestNumber: string = process.env['PR_NUMBER'] ?? '';
  const targetDirectory: string = process.env['TARGET_DIR'] ?? '';

  if (pullRequestNumber === '' || targetDirectory === '') {
    throw new Error('Missing required PR_NUMBER or TARGET_DIR for cleanup-pr mode.');
  }

  if (!isStorybookPrCleanupTargetDirectory(targetDirectory)) {
    throw new Error(
      `Invalid TARGET_DIR for cleanup-pr mode: ${JSON.stringify(targetDirectory)}. Expected "storybook/mr/<number>".`,
    );
  }

  // If gh-pages branch does not exist yet, cleanup is a no-op.
  try {
    await execCommand(logger, 'git', ['ls-remote', '--exit-code', '--heads', 'origin', 'gh-pages']);
  } catch (error: unknown) {
    if (error instanceof ExecCommandError) {
      logger.info('No gh-pages branch found. Nothing to clean.');
      return;
    }

    throw error;
  }

  await execCommandInherit(logger, 'git', ['fetch', 'origin', 'gh-pages']);
  await execCommandInherit(logger, 'git', ['checkout', 'gh-pages']);

  const targetDirectoryExists: boolean = await execCommand(logger, 'test', ['-d', targetDirectory])
    .then((): boolean => true)
    .catch((error: unknown): boolean => {
      if (error instanceof ExecCommandError) {
        return false;
      }

      throw error;
    });

  if (targetDirectoryExists) {
    await execCommandInherit(logger, 'rm', ['-rf', targetDirectory]);
    await execCommandInherit(logger, 'rmdir', [
      '--ignore-fail-on-non-empty',
      '-p',
      dirname(targetDirectory),
    ]);
  } else {
    logger.info(`Directory ${JSON.stringify(targetDirectory)} does not exist.`);
  }

  // Remove accidentally published dependency directories from gh-pages.
  await execCommandInherit(logger, 'rm', ['-rf', ...GH_PAGES_JUNK_DIRECTORIES]);

  await execCommandInherit(logger, 'git', ['add', '-u']);

  const hasChanges: boolean = await execCommand(logger, 'git', ['diff', '--staged', '--quiet'])
    .then((): boolean => false)
    .catch((error: unknown): boolean => {
      if (error instanceof ExecCommandError && error.exitCode === 1) {
        return true;
      }

      throw error;
    });

  if (!hasChanges) {
    logger.info('No changes to commit after cleanup.');
    return;
  }

  await execCommandInherit(logger, 'git', ['config', 'user.name', 'github-actions[bot]']);
  await execCommandInherit(logger, 'git', [
    'config',
    'user.email',
    '41898282+github-actions[bot]@users.noreply.github.com',
  ]);
  await execCommandInherit(logger, 'git', [
    'commit',
    '-m',
    createCleanupCommitMessage(pullRequestNumber),
  ]);
  await execCommandInherit(logger, 'git', ['push', 'origin', 'HEAD:gh-pages']);
}

export async function storybookPagesScript(): Promise<void> {
  return logger.asyncTask('storybook-pages.script', async (): Promise<void> => {
    loadOptionallyEnvFile(logger);

    const mode: StorybookPagesScriptMode = getMode();

    if (mode === 'prepare') {
      await runPrepareMode();
      return;
    }

    if (mode === 'cleanup-pr') {
      await runCleanupPrMode();
      return;
    }

    await runPostbuildMode();
  });
}

try {
  await storybookPagesScript();
} catch (error: unknown) {
  logger.fatal(error);
}
