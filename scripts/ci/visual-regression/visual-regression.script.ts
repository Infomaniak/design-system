import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { getCliArgValue } from '../../helpers/ci/get-cli-arg-value.ts';
import { loadOptionallyEnvFile } from '../../helpers/env/env-file/load-optionally-env-file.ts';
import { getEnvVariable } from '../../helpers/env/get-env-variable.ts';
import { getIntegerEnvVariable } from '../../helpers/env/types/get-integer-env-variable.ts';
import {
  buildRunUrl,
  parseRepository,
  readEventPayload,
} from '../../helpers/github/api/github-ci-context.ts';
import { upsertComment } from '../../helpers/github/api/issue-comments.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';
import {
  createVisualRegressionCommentMessage,
  mergeMetadata,
  parsePlaywrightJsonReport,
  VR_COMMENT_MARKER,
  type VisualRegressionResult,
  type VrMetadata,
} from './src/visual-regression.ts';

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

function getMode(): string {
  const mode: string | undefined = getCliArgValue(process.argv, '--mode') ?? process.env['VR_MODE'];

  if (mode === undefined || mode === '') {
    throw new Error('Missing --mode argument. Expected --mode=comment.');
  }

  return mode;
}

async function readPlaywrightReport(): Promise<VisualRegressionResult> {
  const reportPath: string = process.env['VR_REPORT_PATH'] ?? 'playwright-vr-results.json';

  let reportJson: unknown;

  try {
    reportJson = JSON.parse(await readFile(reportPath, { encoding: 'utf8' }));
  } catch (error: unknown) {
    logger.warn('Failed to read Playwright JSON report.', error);
    return {
      status: 'errored',
      passed: 0,
      failed: 0,
      skippedNew: 0,
      skippedMissing: 0,
      errored: 0,
      total: 0,
      failedStoryIds: [],
      skippedNewStoryIds: [],
      skippedMissingStoryIds: [],
      errorStoryIds: [],
      errorMessage: 'Playwright JSON report not found or unreadable.',
    };
  }

  const baseResult: VisualRegressionResult = parsePlaywrightJsonReport(reportJson);
  const metadataPath: string =
    process.env['VR_METADATA_PATH'] ?? 'playwright-vr-results-metadata.json';

  try {
    const metadataJson: unknown = JSON.parse(await readFile(metadataPath, { encoding: 'utf8' }));
    const metadata: VrMetadata = {
      newStoryIds: Array.isArray((metadataJson as { newStoryIds?: unknown })['newStoryIds'])
        ? ((metadataJson as { newStoryIds: unknown[] })['newStoryIds'] as readonly string[])
        : [],
      missingStoryIds: Array.isArray(
        (metadataJson as { missingStoryIds?: unknown })['missingStoryIds'],
      )
        ? ((metadataJson as { missingStoryIds: unknown[] })['missingStoryIds'] as readonly string[])
        : [],
    };

    return mergeMetadata(baseResult, metadata);
  } catch (error: unknown) {
    logger.warn(
      `No VR metadata sidecar found at ${metadataPath}; skipped new/missing will be empty.`,
      error,
    );
    return baseResult;
  }
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

  const result: VisualRegressionResult = await readPlaywrightReport();
  const artifactName: string | undefined = process.env['VR_ARTIFACT_NAME'];
  const artifactRetentionDays: number = getIntegerEnvVariable('VR_ARTIFACT_RETENTION_DAYS', 3);

  const commentBody: string = createVisualRegressionCommentMessage({
    result,
    runUrl: buildRunUrl({
      serverUrl: process.env['GITHUB_SERVER_URL'] ?? 'https://github.com',
      repository: getEnvVariable('GITHUB_REPOSITORY'),
      runId: getEnvVariable('GITHUB_RUN_ID'),
    }),
    artifactName:
      artifactName !== undefined && artifactName.trim() !== '' ? artifactName : undefined,
    artifactRetentionDays,
  });

  const { owner, repo } = parseRepository(getEnvVariable('GITHUB_REPOSITORY'));

  try {
    await upsertComment({
      body: commentBody,
      label: 'visual regression',
      logger,
      marker: VR_COMMENT_MARKER,
      owner,
      pullRequestNumber: payload.pull_request.number,
      repo,
      token,
    });
  } catch (error: unknown) {
    logger.warn('Unable to post visual regression PR comment.', error);
  }
}

export async function visualRegressionScript(): Promise<void> {
  return logger.asyncTask('visual-regression.script', async (): Promise<void> => {
    loadOptionallyEnvFile(logger);

    const mode: string = getMode();

    if (mode === 'comment') {
      await runCommentMode();
      return;
    }

    throw new Error(`Unsupported mode: ${mode}. Expected --mode=comment.`);
  });
}

try {
  await visualRegressionScript();
} catch (error: unknown) {
  logger.fatal(error);
}
