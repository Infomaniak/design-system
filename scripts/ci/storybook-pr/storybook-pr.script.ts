import { appendFile, readFile } from 'node:fs/promises';
import process from 'node:process';
import { getEnvVariable } from '../../helpers/env/get-env-variable.ts';
import { loadOptionallyEnvFile } from '../../helpers/env/load-env-file.ts';
import { parseBoolean, parseInteger, parseStringArray } from '../../helpers/env/parse-value.ts';
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

interface GithubIssueComment {
  readonly id: number;
  readonly body: string | null;
}

interface GithubPullRequestSummary {
  readonly number: number;
  readonly draft: boolean;
}

interface GithubEventPayload {
  readonly pull_request?: GithubPullRequestSummary;
}

type StorybookPrScriptMode = 'prepare' | 'comment';

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

function getArgValue(name: string): string | undefined {
  const prefix: string = `${name}=`;

  const arg: string | undefined = process.argv.find((value: string): boolean => {
    return value.startsWith(prefix);
  });

  return arg === undefined ? undefined : arg.slice(prefix.length);
}

function getMode(): StorybookPrScriptMode {
  const mode: string | undefined = getArgValue('--mode') ?? process.env['STORYBOOK_PR_MODE'];

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

function getRepository(): { owner: string; repo: string } {
  const fullName: string = getEnvVariable('GITHUB_REPOSITORY');
  const [owner, repo]: readonly string[] = fullName.split('/');

  if (owner === undefined || repo === undefined || owner === '' || repo === '') {
    throw new Error(`Invalid GITHUB_REPOSITORY value: ${fullName}`);
  }

  return { owner, repo };
}

async function getEventPayload(): Promise<GithubEventPayload> {
  const eventPath: string = getEnvVariable('GITHUB_EVENT_PATH');
  const eventPayload: unknown = JSON.parse(await readFile(eventPath, { encoding: 'utf8' }));

  if (typeof eventPayload !== 'object' || eventPayload === null) {
    throw new Error('Invalid GitHub event payload.');
  }

  return eventPayload as GithubEventPayload;
}

function getRunUrl(): string {
  const serverUrl: string = process.env['GITHUB_SERVER_URL'] ?? 'https://github.com';
  const runId: string = getEnvVariable('GITHUB_RUN_ID');
  const repository: string = getEnvVariable('GITHUB_REPOSITORY');

  return `${serverUrl}/${repository}/actions/runs/${runId}`;
}

async function writeGithubOutput(name: string, value: string): Promise<void> {
  const outputPath: string | undefined = process.env['GITHUB_OUTPUT'];

  if (outputPath === undefined || outputPath === '') {
    logger.warn(`Skipping output ${name}: GITHUB_OUTPUT is not available.`);
    return;
  }

  await appendFile(outputPath, `${name}=${value}\n`, { encoding: 'utf8' });
}

async function githubRequest<TResponse>({
  method,
  path,
  token,
  body,
}: {
  method: 'GET' | 'POST' | 'PATCH';
  path: string;
  token: string;
  body?: unknown;
}): Promise<TResponse> {
  const response: Response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'infomaniak-design-system-ci',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const text: string = await response.text();
    throw new Error(`GitHub API ${method} ${path} failed (${response.status}): ${text}`);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
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

  for (let page: number = 1; page < 100; page++) {
    const pageFiles: readonly PullRequestFile[] = await githubRequest<readonly PullRequestFile[]>({
      method: 'GET',
      path: `/repos/${owner}/${repo}/pulls/${pullRequestNumber}/files?per_page=100&page=${page}`,
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

    if (pageFiles.length < 100) {
      break;
    }
  }

  return files;
}

async function listIssueComments({
  owner,
  pullRequestNumber,
  repo,
  token,
}: {
  owner: string;
  repo: string;
  pullRequestNumber: number;
  token: string;
}): Promise<readonly GithubIssueComment[]> {
  const comments: GithubIssueComment[] = [];

  for (let page: number = 1; page < 100; page++) {
    const pageComments: readonly GithubIssueComment[] = await githubRequest<
      readonly GithubIssueComment[]
    >({
      method: 'GET',
      path: `/repos/${owner}/${repo}/issues/${pullRequestNumber}/comments?per_page=100&page=${page}`,
      token,
    });

    if (pageComments.length === 0) {
      break;
    }

    comments.push(...pageComments);

    if (pageComments.length < 100) {
      break;
    }
  }

  return comments;
}

async function upsertStorybookComment({
  body,
  owner,
  pullRequestNumber,
  repo,
  token,
}: {
  owner: string;
  repo: string;
  pullRequestNumber: number;
  token: string;
  body: string;
}): Promise<void> {
  const comments: readonly GithubIssueComment[] = await listIssueComments({
    owner,
    pullRequestNumber,
    repo,
    token,
  });

  const existingComment: GithubIssueComment | undefined = comments.find(
    (comment: GithubIssueComment): boolean => {
      return typeof comment.body === 'string' && comment.body.includes(STORYBOOK_PR_COMMENT_MARKER);
    },
  );

  if (existingComment !== undefined) {
    await githubRequest<undefined>({
      method: 'PATCH',
      path: `/repos/${owner}/${repo}/issues/comments/${existingComment.id}`,
      token,
      body: { body },
    });
    logger.info(`Updated Storybook PR comment (${existingComment.id}).`);
    return;
  }

  await githubRequest<undefined>({
    method: 'POST',
    path: `/repos/${owner}/${repo}/issues/${pullRequestNumber}/comments`,
    token,
    body: { body },
  });

  logger.info('Created Storybook PR comment.');
}

async function runPrepareMode(): Promise<void> {
  if (process.env['GITHUB_EVENT_NAME'] !== 'pull_request') {
    await writeGithubOutput('should_build', 'true');
    await writeGithubOutput('decision_reason', 'relevant-change');
    await writeGithubOutput('changed_files_count', '0');
    await writeGithubOutput('relevant_files_json', '[]');
    await writeGithubOutput('artifact_name', 'storybook-pr');
    return;
  }

  const token: string = getEnvVariable('GITHUB_TOKEN');
  const payload: GithubEventPayload = await getEventPayload();

  if (payload.pull_request === undefined) {
    throw new Error('Expected pull_request object in event payload.');
  }

  const { owner, repo } = getRepository();
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

  await writeGithubOutput('pull_request_number', String(pullRequestNumber));
  await writeGithubOutput('should_build', String(decision.shouldBuild));
  await writeGithubOutput('decision_reason', decision.reason);
  await writeGithubOutput('changed_files_count', String(decision.changedFilesCount));
  await writeGithubOutput('relevant_files_json', JSON.stringify(decision.relevantFiles));
  await writeGithubOutput('artifact_name', `storybook-pr-${pullRequestNumber}`);

  logger.info('Storybook build decision:', decision);
}

async function runCommentMode(): Promise<void> {
  if (process.env['GITHUB_EVENT_NAME'] !== 'pull_request') {
    logger.info('Skipping PR comment because event is not pull_request.');
    return;
  }

  const token: string = getEnvVariable('GITHUB_TOKEN');
  const payload: GithubEventPayload = await getEventPayload();

  if (payload.pull_request === undefined) {
    throw new Error('Expected pull_request object in event payload.');
  }

  const shouldBuild: boolean = parseBoolean(process.env['STORYBOOK_SHOULD_BUILD']);
  const buildStepOutcome: string = process.env['STORYBOOK_BUILD_OUTCOME'] ?? 'failure';
  const reason: StorybookPrBuildReason = parseReason(process.env['STORYBOOK_DECISION_REASON']);
  const changedFilesCount: number = parseInteger(process.env['STORYBOOK_CHANGED_FILES_COUNT'], 0);
  const relevantFiles: readonly string[] = parseStringArray(
    process.env['STORYBOOK_RELEVANT_FILES_JSON'],
  );
  const artifactName: string | undefined = process.env['STORYBOOK_ARTIFACT_NAME'];

  const outcome = resolveStorybookPrBuildOutcome({
    shouldBuild,
    buildStepOutcome,
  });

  const commentBody: string = createStorybookPrCommentMessage({
    artifactName,
    changedFilesCount,
    outcome,
    reason,
    relevantFiles,
    runUrl: getRunUrl(),
  });

  const { owner, repo } = getRepository();

  try {
    await upsertStorybookComment({
      owner,
      pullRequestNumber: payload.pull_request.number,
      repo,
      token,
      body: commentBody,
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
