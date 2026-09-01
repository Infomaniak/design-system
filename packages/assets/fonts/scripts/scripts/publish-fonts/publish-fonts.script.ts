import { glob, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getEnvGithubCiConfig } from '../../../../../../scripts/helpers/github/github-ci-config/env/get-env-github-ci-config.ts';
import { getEnvGitlabFontsRepositoryToken } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-token.ts';
import { getEnvGitlabFontsRepositoryUrl } from '../../../../../../scripts/helpers/gitlab/env/get-env-gitlab-fonts-repository-url.ts';
import { pushGitlabFonts } from '../../../../../../scripts/helpers/gitlab/git/push-gitlab-fonts.ts';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { getEnvCiPublishDryRun } from '../../../../../../scripts/helpers/publish/env/get-env-ci-publish-dry-run.ts';
import { getEnvPublishConfig } from '../../../../../../scripts/helpers/publish/publish-config/env/get-env-publish-config.ts';
import { publishModeToFontPublishDirectory } from '../../../../../../scripts/helpers/publish/publish-mode/publish-mode-to-font-publish-directory.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const DIST_WEB_DIR: string = join(ROOT_DIR, 'dist', 'web');

await runScript('publish-fonts', async (logger: Logger): Promise<void> => {
  if (getEnvCiPublishDryRun()) {
    logger.info('Dry run: skipping fonts publication.');
    return;
  }

  const { mode } = getEnvPublishConfig();

  const { sha } = getEnvGithubCiConfig();
  const shortSha: string = sha.slice(0, 7);

  const fontPublishDirectory: string = publishModeToFontPublishDirectory(mode);

  const fileNames: string[] = [];

  for await (const filePath of glob([`${DIST_WEB_DIR}/*.woff2`, `${DIST_WEB_DIR}/*.min.css`])) {
    fileNames.push(basename(filePath));
  }

  if (fileNames.length === 0) {
    throw new Error(`No WOFF2 or min.css files found in ${DIST_WEB_DIR}.`);
  }

  await logger.asyncTask('push-gitlab-fonts', async (): Promise<void> => {
    await pushGitlabFonts({
      repositoryUrl: getEnvGitlabFontsRepositoryUrl(),
      repositoryToken: getEnvGitlabFontsRepositoryToken(),
      sourceDirectory: DIST_WEB_DIR,
      fileNames,
      targetDirectoryName: fontPublishDirectory,
      commitMessage: `chore: publish fonts ${mode} ${shortSha}`,
      workDirectory: await mkdtemp(join(tmpdir(), 'publish-fonts-')),
    });
  });
});
