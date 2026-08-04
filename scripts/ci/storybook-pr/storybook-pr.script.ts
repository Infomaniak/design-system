import process from 'node:process';
import { getCliArgValue } from '../../helpers/ci/get-cli-arg-value.ts';
import { writeGithubOutput } from '../../helpers/ci/write-github-output.ts';
import { loadOptionallyEnvFile } from '../../helpers/env/env-file/load-optionally-env-file.ts';
import { getEnvVariable } from '../../helpers/env/get-env-variable.ts';
import { parseBoolean, parseInteger, parseStringArray } from '../../helpers/env/parse-value.ts';
import {
  buildRunUrl,
  parseRepository,
  readEventPayload,
} from '../../helpers/github/api/github-ci-context.ts';
import { githubRequest } from '../../helpers/github/api/github-request.ts';
import { upsertComment } from '../../helpers/github/api/issue-comments.ts';
import {
  GITHUB_API_MAX_PAGES,
  GITHUB_API_PAGE_SIZE,
} from '../../helpers/github/constants/github-api.constants.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';
import {
  createStorybookPrCommentMessage,
  evaluateStorybookPrBuild,
  resolveStorybookPrBuildOutcome,
  STORYBOOK_PR_COMMENT_MARKER,
  type StorybookPrBuildReason,
} from './src/storybook-pr.ts';

interface PullRequestFile {
  readonly filename: string;
}

type StorybookPrScriptMode = 'prepare' | 'comment';

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

function getMode(): StorybookPrScriptMode {
  const mode: string | undefined =
    getCliArgValue(process.argv, '--mode') ?? process.env['STORYBOOK_PR_MODE'];

  if (mode !== 'prepare' && mode !== 'comment') {
    throw new Error('Invalid mode. Expected --mode=prepare or --mode=comment.');
  }

  return mode;
}

function parseReason(value: string | undefined): StorybookPrBuildReason {
  if (value === 'draft-pr' || value === 'no-relevant-change' || value === 'relevant-change') {
    return value;
  }

  return 'relevant-change';
}

async function listPullRequestChangedFiles({
  owner,
  pullRequestNumber,
  repo,
  token,
}: {
  owner: string;
  repo: string;
  pullRequestNumber: number;
  token: string;
}): Promise<readonly string[]> {
  const files: string[] = [];

  for (let page: number = 1; page <= GITHUB_API_MAX_PAGES; page++) {
    const pageFiles: readonly PullRequestFile[] = await githubRequest<readonly PullRequestFile[]>({
      method: 'GET',
      path: `/repos/${owner}/${repo}/pulls/${pullRequestNumber}/files?per_page=${GITHUB_API_PAGE_SIZE}&page=${page}`,
      token,
    });

    if (pageFiles.length === 0) {
      break;
    }

    files.push(
      ...pageFiles
        .map((entry: PullRequestFile): string => {
          return entry.filename;
        })
        .filter((filename: string): boolean => {
          return filename !== '';
        }),
    );

    if (pageFiles.length < GITHUB_API_PAGE_SIZE) {
      break;
    }
  }

  return files;
}

async function runPrepareMode(): Promise<void> {
  if (process.env['GITHUB_EVENT_NAME'] !== 'pull_request') {
    await writeGithubOutput({ logger, name: 'should_build', value: 'true' });
    await writeGithubOutput({ logger, name: 'decision_reason', value: 'relevant-change' });
    await writeGithubOutput({ logger, name: 'changed_files_count', value: '0' });
    await writeGithubOutput({ logger, name: 'relevant_files_json', value: '[]' });
    await writeGithubOutput({ logger, name: 'artifact_name', value: 'storybook-pr' });
    return;
  }

  const token: string = getEnvVariable('GITHUB_TOKEN');
  const payload = await readEventPayload(getEnvVariable('GITHUB_EVENT_PATH'));

  if (payload.pull_request === undefined) {
    throw new Error('Expected pull_request object in event payload.');
  }

  const { owner, repo } = parseRepository(getEnvVariable('GITHUB_REPOSITORY'));
  const pullRequestNumber: number = payload.pull_request.number;
  const changedFiles: readonly string[] = await listPullRequestChangedFiles({
    owner,
    repo,
    pullRequestNumber,
    token,
  });

  const decision = evaluateStorybookPrBuild({
    changedFiles,
    isDraft: payload.pull_request.draft,
  });

  await writeGithubOutput({
    logger,
    name: 'pull_request_number',
    value: String(pullRequestNumber),
  });
  await writeGithubOutput({ logger, name: 'should_build', value: String(decision.shouldBuild) });
  await writeGithubOutput({ logger, name: 'decision_reason', value: decision.reason });
  await writeGithubOutput({
    logger,
    name: 'changed_files_count',
    value: String(decision.changedFilesCount),
  });
  await writeGithubOutput({
    logger,
    name: 'relevant_files_json',
    value: JSON.stringify(decision.relevantFiles),
  });
  await writeGithubOutput({
    logger,
    name: 'artifact_name',
    value: `storybook-pr-${pullRequestNumber}`,
  });

  logger.info('Storybook build decision:', decision);
}

async function runCommentMode(): Promise<void> {
  if (process.env['GITHUB_EVENT_NAME'] !== 'pull_request') {
    logger.info('Skipping PR comment because event is not pull_request.');
    return;
  }

  const token: string = getEnvVariable('GITHUB_TOKEN');
  const payload = await readEventPayload(getEnvVariable('GITHUB_EVENT_PATH'));

  if (payload.pull_request === undefined) {
    throw new Error('Expected pull_request object in event payload.');
  }

  const shouldBuild: boolean = parseBoolean(process.env['STORYBOOK_SHOULD_BUILD']);
  const buildStepOutcome: string = process.env['STORYBOOK_BUILD_OUTCOME'] ?? 'failure';
  const deployStepOutcome: string | undefined = process.env['STORYBOOK_DEPLOY_OUTCOME'];
  const reason: StorybookPrBuildReason = parseReason(process.env['STORYBOOK_DECISION_REASON']);
  const changedFilesCount: number = parseInteger(process.env['STORYBOOK_CHANGED_FILES_COUNT'], 0);
  const relevantFiles: readonly string[] = parseStringArray(
    process.env['STORYBOOK_RELEVANT_FILES_JSON'],
  );
  const artifactNameFromEnv: string | undefined = process.env['STORYBOOK_ARTIFACT_NAME'];
  const artifactName: string | undefined =
    artifactNameFromEnv === undefined || artifactNameFromEnv.trim() === ''
      ? undefined
      : artifactNameFromEnv;
  const artifactRetentionDays: number = parseInteger(
    process.env['STORYBOOK_ARTIFACT_RETENTION_DAYS'],
    3,
  );
  const deploymentUrl: string | undefined = process.env['STORYBOOK_DEPLOYMENT_URL'];

  const outcome = resolveStorybookPrBuildOutcome({
    shouldBuild,
    buildStepOutcome,
    deployStepOutcome,
  });

  const commentBody: string = createStorybookPrCommentMessage({
    artifactName,
    artifactRetentionDays,
    changedFilesCount,
    deploymentUrl,
    outcome,
    reason,
    relevantFiles,
    runUrl: buildRunUrl({
      serverUrl: process.env['GITHUB_SERVER_URL'] ?? 'https://github.com',
      repository: getEnvVariable('GITHUB_REPOSITORY'),
      runId: getEnvVariable('GITHUB_RUN_ID'),
    }),
  });

  const { owner, repo } = parseRepository(getEnvVariable('GITHUB_REPOSITORY'));

  try {
    await upsertComment({
      body: commentBody,
      label: 'Storybook',
      logger,
      marker: STORYBOOK_PR_COMMENT_MARKER,
      owner,
      pullRequestNumber: payload.pull_request.number,
      repo,
      token,
    });
  } catch (error: unknown) {
    logger.warn('Unable to post Storybook PR comment.', error);
  }
}

export async function storybookPrScript(): Promise<void> {
  return logger.asyncTask('storybook-pr.script', async (): Promise<void> => {
    loadOptionallyEnvFile(logger);

    const mode: StorybookPrScriptMode = getMode();

    if (mode === 'prepare') {
      await runPrepareMode();
      return;
    }

    await runCommentMode();
  });
}

try {
  await storybookPrScript();
} catch (error: unknown) {
  logger.fatal(error);
}
