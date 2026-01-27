import { join, resolve } from 'node:path';
import { readJsonFile } from '../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../scripts/helpers/misc/exec-command.ts';

export interface PublishTokensOptions {
  readonly outputDirectory: string;
  readonly mode: 'prod' | 'dev';
  readonly logger: Logger;
}

export interface PublishTokensResult {
  readonly npm: {
    readonly version: string;
  };
}

export interface PublishTokensNpmResult {
  readonly version: string;
}

export function publishTokens({
  outputDirectory,
  mode,
  logger,
}: PublishTokensOptions): Promise<PublishTokensResult> {
  return logger.asyncTask(
    `publish-tokens (${mode})`,
    async (logger: Logger): Promise<PublishTokensResult> => {
      return {
        npm: await logger.asyncTask('npm', async (): Promise<PublishTokensNpmResult> => {
          const webPackageDirectory: string = join(outputDirectory, 'web');
          const webPackageFile: string = join(webPackageDirectory, 'package.json');

          const packageJsonContent: any = await readJsonFile(webPackageFile);

          const args: string[] = [
            '--//registry.npmjs.org/:_authToken=$NPM_TOKEN',
            'publish',
            '--access',
            'public',
          ];

          let version: string;

          if (mode === 'dev') {
            if (packageJsonContent.version.includes('-')) {
              throw new Error(`Invalid version: ${packageJsonContent.version}.`);
            }

            version = `${packageJsonContent.version}-dev.${Date.now()}`;

            await writeJsonFileSafe(webPackageFile, {
              ...packageJsonContent,
              version,
            });

            args.push('--tag', 'dev');
          } else {
            version = packageJsonContent.version;
          }

          try {
            await execCommandInherit(logger, 'npm', args, {
              shell: true,
              env: process.env,
              cwd: resolve(webPackageDirectory),
            });

            return {
              version,
            };
          } finally {
            if (mode === 'dev') {
              await writeJsonFileSafe(webPackageFile, packageJsonContent);
            }
          }
        }),
      };
    },
  );
}
