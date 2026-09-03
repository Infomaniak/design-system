import { execFile } from 'node:child_process';
import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

export interface PushGitlabFontsOptions {
  readonly repositoryUrl: string;
  readonly repositoryToken: string;
  readonly sourceDirectory: string;
  readonly fileNames: readonly string[];
  readonly targetDirectoryName: string;
  readonly commitMessage: string;
  readonly workDirectory: string;
}

const GIT_USER_NAME = 'design-system-ci';

const GIT_USER_EMAIL = 'design-system-ci@infomaniak.com';

const REDACTED = '***';

function redact(value: string, secret: string): string {
  return secret.length === 0 ? value : value.replaceAll(secret, REDACTED);
}

function runGit(args: readonly string[], repositoryToken: string, cwd: string): Promise<void> {
  return new Promise<void>((resolve, reject): void => {
    execFile('git', [...args], { cwd }, (error) => {
      if (error !== null) {
        const message = `git ${redact(args.join(' '), repositoryToken)} failed: ${redact(
          error.message,
          repositoryToken,
        )}`;
        reject(new Error(message));
        return;
      }

      resolve();
    });
  });
}

export async function pushGitlabFonts({
  repositoryUrl,
  repositoryToken,
  sourceDirectory,
  fileNames,
  targetDirectoryName,
  commitMessage,
  workDirectory,
}: PushGitlabFontsOptions): Promise<void> {
  const repositoryUrlWithAuth: string = repositoryUrl.replace(
    'https://',
    `https://oauth2:${repositoryToken}@`,
  );

  const repositoryDirectory: string = join(workDirectory, 'repository');
  const fontsDirectory: string = join(repositoryDirectory, targetDirectoryName);

  await runGit(
    ['clone', '--depth', '1', repositoryUrlWithAuth, repositoryDirectory],
    repositoryToken,
    workDirectory,
  );

  await mkdir(fontsDirectory, { recursive: true });

  const existingFileNames: string[] = await readdir(fontsDirectory);

  for (const existingFileName of existingFileNames) {
    if (existingFileName !== '.gitkeep') {
      await rm(join(fontsDirectory, existingFileName));
    }
  }

  for (const fileName of fileNames) {
    await copyFile(join(sourceDirectory, fileName), join(fontsDirectory, fileName));
  }

  await runGit(['add', '-A'], repositoryToken, repositoryDirectory);

  await runGit(
    [
      '-c',
      `user.name=${GIT_USER_NAME}`,
      '-c',
      `user.email=${GIT_USER_EMAIL}`,
      'commit',
      '--allow-empty',
      '-m',
      commitMessage,
    ],
    repositoryToken,
    repositoryDirectory,
  );

  await runGit(['push', 'origin', 'HEAD'], repositoryToken, repositoryDirectory);
}
