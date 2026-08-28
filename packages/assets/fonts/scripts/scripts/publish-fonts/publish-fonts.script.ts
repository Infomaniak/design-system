import { glob, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTarGzArchive } from '../../../../../../scripts/helpers/file/archive/create-tar-gz-archive.ts';
import { getEnvGithubCiConfig } from '../../../../../../scripts/helpers/github/github-ci-config/env/get-env-github-ci-config.ts';
import { triggerGitlabFontsPipeline } from '../../../../../../scripts/helpers/gitlab/api/trigger-gitlab-fonts-pipeline.ts';
import { getEnvGitlabFontsRepositoryToken } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-token.ts';
import { getEnvGitlabFontsRepositoryUrl } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-url.ts';
import { getEnvGitlabFontsTriggerRef } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-ref.ts';
import { getEnvGitlabFontsTriggerToken } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-token.ts';
import { getEnvGitlabFontsTriggerUrl } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-trigger-url.ts';
import { pushGitlabFontsArchive } from '../../../../../../scripts/helpers/gitlab/git/push-gitlab-fonts-archive.ts';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { getEnvCiPublishDryRun } from '../../../../../../scripts/helpers/publish/env/get-env-ci-publish-dry-run.ts';
import { getEnvPublishConfig } from '../../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const DIST_WEB_DIR: string = join(ROOT_DIR, 'dist', 'web');

await runScript('publish-fonts', async (logger: Logger): Promise<void> => {
  if (getEnvCiPublishDryRun()) {
    logger.info('Dry run: skipping fonts archive publication.');
    return;
  }

  const { mode } = getEnvPublishConfig();

  const { sha } = getEnvGithubCiConfig();
  const shortSha: string = sha.slice(0, 7);

  const archiveName: string = `fonts-${mode}-${shortSha}.tar.gz`;

  const fileNames: string[] = [];

  for await (const filePath of glob(`${DIST_WEB_DIR}/*.woff2`)) {
    fileNames.push(basename(filePath));
  }

  for await (const filePath of glob(`${DIST_WEB_DIR}/*.min.css`)) {
    fileNames.push(basename(filePath));
  }

  if (fileNames.length === 0) {
    throw new Error(`No WOFF2 or min.css files found in ${DIST_WEB_DIR}.`);
  }

  const archivePath: string = await logger.asyncTask(
    'create-fonts-archive',
    async (): Promise<string> => {
      return createTarGzArchive({
        sourceDirectory: DIST_WEB_DIR,
        fileNames,
        archiveName,
      });
    },
  );

  await logger.asyncTask('push-gitlab-fonts-archive', async (): Promise<void> => {
    await pushGitlabFontsArchive({
      repositoryUrl: getEnvGitlabFontsRepositoryUrl(),
      repositoryToken: getEnvGitlabFontsRepositoryToken(),
      archivePath,
      archiveName,
      commitMessage: `chore: publish fonts ${mode} ${shortSha}`,
      workDirectory: await mkdtemp(join(tmpdir(), 'publish-fonts-')),
    });
  });

  await logger.asyncTask('trigger-gitlab-fonts-pipeline', async (): Promise<void> => {
    await triggerGitlabFontsPipeline({
      url: getEnvGitlabFontsTriggerUrl(),
      token: getEnvGitlabFontsTriggerToken(),
      ref: getEnvGitlabFontsTriggerRef(),
      variables: {
        ARCHIVE_NAME: archiveName,
        FONT_MODE: mode,
      },
    });
  });
});
