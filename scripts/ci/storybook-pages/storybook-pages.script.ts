import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { loadOptionallyEnvFile } from '../../helpers/env/load-env-file.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';
import { normalizeStorybookIframeHtml } from './src/normalize-storybook-html.ts';
import {
  resolveStorybookPagesContext,
  type StorybookPagesContext,
} from './src/storybook-pages-context.ts';

type StorybookPagesScriptMode = 'prepare' | 'postbuild';

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

function getArgValue(name: string): string | undefined {
  const prefix: string = `${name}=`;

  const arg: string | undefined = process.argv.find((value: string): boolean => {
    return value.startsWith(prefix);
  });

  return arg === undefined ? undefined : arg.slice(prefix.length);
}

function getMode(): StorybookPagesScriptMode {
  const mode: string | undefined = getArgValue('--mode') ?? process.env['STORYBOOK_PAGES_MODE'];

  if (mode !== 'prepare' && mode !== 'postbuild') {
    throw new Error('Invalid mode. Expected --mode=prepare or --mode=postbuild.');
  }

  return mode;
}

async function writeGithubOutput(name: string, value: string): Promise<void> {
  const outputPath: string | undefined = process.env['GITHUB_OUTPUT'];

  if (outputPath === undefined || outputPath === '') {
    logger.warn(`Skipping output ${name}: GITHUB_OUTPUT is not available.`);
    return;
  }

  await appendFile(outputPath, `${name}=${value}\n`, { encoding: 'utf8' });
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

  await writeGithubOutput('should_deploy', String(context.shouldDeploy));

  if (!context.shouldDeploy) {
    await writeGithubOutput('target', '');
    await writeGithubOutput('destination_dir', '');
    await writeGithubOutput('public_url', '');
    await writeGithubOutput('environment_name', '');
    logger.warn('Storybook pages deployment context not available for this event/ref.');
    return;
  }

  await writeGithubOutput('target', context.target);
  await writeGithubOutput('destination_dir', context.destinationDir);
  await writeGithubOutput('public_url', context.publicUrl);
  await writeGithubOutput('environment_name', context.environmentName);

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

export async function storybookPagesScript(): Promise<void> {
  return logger.asyncTask('storybook-pages.script', async (): Promise<void> => {
    loadOptionallyEnvFile(logger);

    const mode: StorybookPagesScriptMode = getMode();

    if (mode === 'prepare') {
      await runPrepareMode();
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
