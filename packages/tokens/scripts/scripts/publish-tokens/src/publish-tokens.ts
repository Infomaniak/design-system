import { join, resolve } from 'node:path';
import { readJsonFile } from '../../../../../../scripts/helpers/file/read-json-file.ts';
import { writeJsonFileSafe } from '../../../../../../scripts/helpers/file/write-json-file-safe.ts';
import { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../scripts/helpers/misc/exec-command.ts';

export interface PublishTokensOptions {
  readonly outputDirectory: string;
  readonly mode: 'prod' | 'dev';
  readonly tag?: string;
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

export interface BuildNpmPublishArgsOptions {
  readonly mode: 'prod' | 'dev';
  readonly tag?: string;
}

export function buildNpmPublishArgs({ mode, tag }: BuildNpmPublishArgsOptions): string[] {
  const args: string[] = ['--//registry.npmjs.org/:_authToken=$NPM_TOKEN', 'publish', '--access', 'public'];

  if (mode === 'dev') {
    args.push('--tag', 'dev');
    return args;
  }

  if (tag !== undefined && tag !== '') {
    args.push('--tag', tag);
  }

  return args;
}

export function publishTokens({
  outputDirectory,
  mode,
  tag,
  logger,
}: PublishTokensOptions): Promise<PublishTokensResult> {
  return logger.asyncTask(
    `publish-tokens (${mode})`,
    async (logger: Logger): Promise<PublishTokensResult> => {
      return {
        npm: await logger.asyncTask(
          'npm',
          async (logger: Logger): Promise<PublishTokensNpmResult> => {
            const webPackageDirectory: string = join(outputDirectory, 'web');
            const webPackageFile: string = join(webPackageDirectory, 'package.json');

            const packageJsonContent: any = await readJsonFile(webPackageFile);

            const args: string[] = buildNpmPublishArgs({ mode, tag });

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
          },
        ),
      };
    },
  );
}
