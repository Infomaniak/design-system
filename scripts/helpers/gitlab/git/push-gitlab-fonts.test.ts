import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const execFileMock = vi.hoisted(() => vi.fn());
vi.mock('node:child_process', () => ({
  default: { execFile: execFileMock },
  execFile: execFileMock,
}));

import { pushGitlabFonts } from './push-gitlab-fonts.ts';

describe('pushGitlabFonts', () => {
  let tempDir: string;
  let workDir: string;
  let repoDir: string;
  let sourceDir: string;

  const buildOptions = (workDirectory: string) => ({
    repositoryUrl: 'https://gitlab.infomaniak.ch/infomaniak/fonts-delivery.git',
    repositoryToken: 'glpat-token',
    sourceDirectory: sourceDir,
    fileNames: ['inter.woff2', 'inter.min.css'] as const,
    targetDirectoryName: 'latest',
    commitMessage: 'chore: publish fonts prod abc123d',
    workDirectory,
  });

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'push-gitlab-fonts-test-'));
    workDir = join(tempDir, 'work');
    repoDir = join(workDir, 'repository');
    sourceDir = join(tempDir, 'source');
    await mkdir(repoDir, { recursive: true });
    await mkdir(sourceDir, { recursive: true });
    await writeFile(join(sourceDir, 'inter.woff2'), 'woff2-content');
    await writeFile(join(sourceDir, 'inter.min.css'), 'css-content');

    execFileMock.mockReset();
    execFileMock.mockImplementation((...args: unknown[]) => {
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(null);
    });
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('clones, replaces the target directory contents, commits and pushes', async () => {
    await pushGitlabFonts(buildOptions(workDir));

    const repositoryUrlWithAuth =
      'https://oauth2:glpat-token@gitlab.infomaniak.ch/infomaniak/fonts-delivery.git';

    expect(execFileMock).toHaveBeenCalledTimes(4);
    expect(execFileMock.mock.calls.map((call) => [call[0], call[1]])).toEqual([
      ['git', ['clone', '--depth', '1', repositoryUrlWithAuth, repoDir]],
      ['git', ['add', '-A']],
      [
        'git',
        [
          '-c',
          'user.name=design-system-ci',
          '-c',
          'user.email=design-system-ci@infomaniak.com',
          'commit',
          '--allow-empty',
          '-m',
          'chore: publish fonts prod abc123d',
        ],
      ],
      ['git', ['push', 'origin', 'HEAD']],
    ]);

    for (const call of execFileMock.mock.calls.slice(1)) {
      expect(call[2]).toEqual({ cwd: repoDir });
    }

    await expect(
      readFile(join(repoDir, 'latest', 'inter.woff2'), { encoding: 'utf8' }),
    ).resolves.toBe('woff2-content');
    await expect(
      readFile(join(repoDir, 'latest', 'inter.min.css'), { encoding: 'utf8' }),
    ).resolves.toBe('css-content');
  });

  it('removes previous files of the target directory, preserving .gitkeep', async () => {
    const targetDir = join(repoDir, 'latest');
    await mkdir(targetDir, { recursive: true });
    await writeFile(join(targetDir, 'old-font.woff2'), 'old');
    await writeFile(join(targetDir, '.gitkeep'), '');

    await pushGitlabFonts(buildOptions(workDir));

    const fileNames = (await readdir(targetDir)).sort();
    expect(fileNames).toEqual(['.gitkeep', 'inter.min.css', 'inter.woff2']);
  });

  it('redacts the repository token from clone failure errors', async () => {
    execFileMock.mockImplementation((...args: unknown[]) => {
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(
        new Error(
          'Command failed: git clone https://oauth2:glpat-token@gitlab.infomaniak.ch/infomaniak/fonts-delivery.git',
        ),
      );
    });

    const rejection: unknown = await pushGitlabFonts(buildOptions(workDir)).catch(
      (error: unknown) => error,
    );

    expect(rejection).toBeInstanceOf(Error);
    expect((rejection as Error).message).toContain('https://oauth2:***@');
    expect((rejection as Error).message).not.toContain('glpat-token');
  });

  it('does not alter the error message when the token is empty', async () => {
    execFileMock.mockImplementation((...args: unknown[]) => {
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(new Error('clone failed'));
    });

    const options = { ...buildOptions(workDir), repositoryToken: '' };

    await expect(pushGitlabFonts(options)).rejects.toThrow(/clone.*failed/s);
  });

  it('rejects with a descriptive error when a git command fails', async () => {
    execFileMock.mockImplementation((...args: unknown[]) => {
      const command = args[1] as string[];
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(command[0] === 'push' ? new Error('push failed') : null);
    });

    await expect(pushGitlabFonts(buildOptions(workDir))).rejects.toThrow(
      'git push origin HEAD failed: push failed',
    );
  });
});
