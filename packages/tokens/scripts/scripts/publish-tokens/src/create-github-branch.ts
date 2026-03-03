import { rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../scripts/helpers/misc/exec-command.ts';

export interface CopyFilesContext {
    readonly logger: Logger;
    readonly packageDirectory: string;
    readonly repoDirectory: string;
}

export type CopyFilesFn = (context: CopyFilesContext) => Promise<void>;

export interface CreateGithubBranchOptions {
    readonly logger: Logger;
    readonly packageDirectory: string;
    readonly repoName: string;
    readonly version: string;
    readonly copyFiles: CopyFilesFn;
}

export async function createGithubBranchWithNewFiles({
    logger,
    packageDirectory,
    repoName,
    version,
    copyFiles,
}: CreateGithubBranchOptions): Promise<string> {
    packageDirectory = resolve(packageDirectory);

    const repoDirectory: string = join(packageDirectory, repoName);

    await rm(repoDirectory, {
        recursive: true,
        force: true,
    });

    await execCommandInherit(
        logger,
        'git',
        ['clone', `git@github.com:Infomaniak/${repoName}.git`],
        {
            cwd: packageDirectory,
            shell: true,
        },
    );

    await execCommandInherit(logger, 'git', ['checkout', '-b', version], {
        cwd: repoDirectory,
        shell: true,
    });

    await copyFiles({ logger, packageDirectory, repoDirectory });

    await execCommandInherit(logger, 'git', ['add', '.'], {
        cwd: repoDirectory,
        shell: true,
    });

    await execCommandInherit(logger, 'git', ['config', 'user.name', '"github-actions"'], {
        cwd: repoDirectory,
        shell: true,
    });

    await execCommandInherit(logger, 'git', ['config', 'user.email', '"github-actions@github.com"'], {
        cwd: repoDirectory,
        shell: true,
    });

    await execCommandInherit(logger, 'git', ['commit', '-m', `"chore: Update to ${version}"`], {
        cwd: repoDirectory,
        shell: true,
    });

    await execCommandInherit(logger, 'git', ['push', '--set-upstream', 'origin', version], {
        cwd: repoDirectory,
        shell: true,
    });

    return version;
}
