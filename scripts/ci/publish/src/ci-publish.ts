import { join } from 'node:path';
import process from 'node:process';
import type { BuildConfig } from '../../../helpers/build/build-config/build-config.ts';
import { ENV_BUILD_CONFIG } from '../../../helpers/build/build-config/env/get-env-build-config.ts';
import { ENV_IGNORE_ENV_FILE } from '../../../helpers/env/env-file/get-env-ignore-env-file.ts';
import type { PackageJsonDependencies } from '../../../helpers/file/package-json/package-json-dependencies/package-json-dependencies.ts';
import { postKchatWebhookMessage } from '../../../helpers/kchat/api/post-kchat-webhook-message.ts';
import { getEnvKchatWebhookId } from '../../../helpers/kchat/env/get-env-kchat-webhook-id.ts';
import type { Logger } from '../../../helpers/log/logger.ts';
import { execCommandInherit } from '../../../helpers/misc/exec-command.ts';
import { dedent } from '../../../helpers/misc/string/dedent/dedent.ts';
import { generatePackageJsonBuildVersion } from '../../../helpers/npm/generate-package-json-build-version/generate-package-json-build-version.ts';
import { isNpmPackagePublished } from '../../../helpers/npm/is-npm-version-published/is-npm-package-published.ts';
import type { PackageJsonWithPath } from '../../../helpers/publish/discover/discover-package-json-files.ts';
import { getImpactedPackageJsonFiles } from '../../../helpers/publish/discover/get-impacted-package-json-files.ts';
import { ENV_PUBLISH_CONFIG } from '../../../helpers/publish/publish-config/env/get-env-publish-config.ts';
import type { PublishConfig } from '../../../helpers/publish/publish-config/publish-config.ts';
import type { CiPublishContext } from './context/infer-ci-publish-context.ts';

export interface CiPublishOptions extends Omit<CiPublishContext, 'shouldPublish'> {
  readonly rootDirectory: string;
  readonly dryRun?: boolean;
  readonly jobUrl: string;
  readonly logger: Logger;
}

export async function ciPublish({
  rootDirectory,
  dryRun = true,
  logger,
  // publish context
  baseSha,
  jobUrl,
  branchName,
  headSha,
  mode,
}: CiPublishOptions): Promise<void> {
  const packagesDirectory: string = join(rootDirectory, 'packages');
  const shouldNotify: boolean = !dryRun && mode !== 'dev';

  try {
    const publishablePackages: readonly PackageJsonWithPath[] = await logger.asyncTask(
      'get-impacted-package-json-files',
      (logger: Logger): Promise<readonly PackageJsonWithPath[]> => {
        return getImpactedPackageJsonFiles({
          packagesDirectory,
          fromCommitId: baseSha,
          toCommitId: headSha,
          logger,
        });
      },
    );

    if (publishablePackages.length === 0) {
      logger.info('SKIP: No publishable package found.');
      return;
    }

    const { packagesToBuild, ...buildConfig }: GetPackagesToBuildReturn = await logger.asyncTask(
      'get-packages-to-build',
      (logger: Logger): Promise<GetPackagesToBuildReturn> => {
        return getPackagesToBuild({
          publishablePackages,
          mode,
          logger,
        });
      },
    );

    if (packagesToBuild.length === 0) {
      logger.info('SKIP: No publishable package found.');
      return;
    }

    const runYarnWorkspacesCommand = (
      command: string,
      env?: Record<string, string>,
    ): Promise<void> => {
      return logger.asyncTask(command, async (logger: Logger): Promise<void> => {
        const args: string[] = ['workspaces', 'foreach', '--topological-dev', '--recursive'];

        if (dryRun) {
          args.push('--dry-run');
          logger.debug('DRY-RUN');
        }

        for (const [, { name }] of packagesToBuild) {
          args.push('--from', name);
        }

        args.push('run', command);

        await execCommandInherit(logger, 'yarn', args, {
          shell: true,
          env: {
            ...process.env,
            [ENV_IGNORE_ENV_FILE]: JSON.stringify(true),
            ...env,
          },
        });
      });
    };

    await runYarnWorkspacesCommand('build', {
      [ENV_BUILD_CONFIG]: JSON.stringify(buildConfig),
    });

    await runYarnWorkspacesCommand('publish', {
      [ENV_PUBLISH_CONFIG]: JSON.stringify({
        mode: buildConfig.mode,
        prerelease: buildConfig.prerelease,
      } satisfies PublishConfig),
    });

    // TODO update PR comment with dev version

    if (shouldNotify) {
      await logger.asyncTask('send-kchat-notification', async (): Promise<void> => {
        await postKchatWebhookMessage({
          webhookId: getEnvKchatWebhookId(),
          text: dedent`
            #### ✅ publish job succeed (${mode}) - ${branchName}

              - 🔗 ${jobUrl}
          `,
        });
      });
    }
  } catch (error: unknown) {
    if (shouldNotify) {
      await logger.asyncTask('send-kchat-notification', async (): Promise<void> => {
        await postKchatWebhookMessage({
          webhookId: getEnvKchatWebhookId(),
          text: dedent`
              #### ❌ publish job failed (${mode}) - ${branchName}

              - 🔗 ${jobUrl}
              - 💬 ${Error.isError(error) ? error.message : String(error)}
            `,
        });
      });
    }

    throw error;
  }
}

/*---*/

interface GetPackagesToBuildOptions extends Pick<CiPublishContext, 'mode'> {
  readonly publishablePackages: readonly PackageJsonWithPath[];
  readonly logger: Logger;
}

interface GetPackagesToBuildReturn extends BuildConfig {
  readonly packagesToBuild: PackageJsonWithPath[];
}

async function getPackagesToBuild({
  mode,
  publishablePackages,
  logger,
}: GetPackagesToBuildOptions): Promise<GetPackagesToBuildReturn> {
  const prerelease: string | undefined = mode !== 'prod' ? Date.now().toString(10) : undefined;
  const dependenciesOverride: PackageJsonDependencies = {};
  const packagesToBuild: PackageJsonWithPath[] = [];

  for (const entry of publishablePackages) {
    const [, { name, version }]: PackageJsonWithPath = entry;

    const buildVersion: string = generatePackageJsonBuildVersion({
      version,
      mode,
      prerelease,
    });

    if (
      await isNpmPackagePublished({
        name,
        version,
      })
    ) {
      logger.debug(`OMIT: ${name}@${buildVersion} (@${version} already exists on npm).`);
    } else {
      logger.debug(`ADD: ${name}@${buildVersion}`);
      packagesToBuild.push(entry);
      Reflect.set(dependenciesOverride, name, version);
    }
  }

  return {
    packagesToBuild,
    mode,
    prerelease,
    dependenciesOverride,
  };
}
