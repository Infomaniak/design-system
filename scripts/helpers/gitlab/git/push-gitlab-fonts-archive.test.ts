import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PushGitlabFontsArchiveOptions } from './push-gitlab-fonts-archive.ts';
import { pushGitlabFontsArchive } from './push-gitlab-fonts-archive.ts';

const execFileMock = vi.hoisted(() => vi.fn());
vi.mock('node:child_process', () => ({
  default: { execFile: execFileMock },
  execFile: execFileMock,
}));

describe('pushGitlabFontsArchive', () => {
  let tempDir: string;
  let workDir: string;
  let repoDir: string;
  let archivePath: string;
  let defaultOptions: PushGitlabFontsArchiveOptions;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'push-gitlab-fonts-test-'));
    workDir = join(tempDir, 'work');
    repoDir = join(workDir, 'repository');
    await mkdir(repoDir, { recursive: true });

    archivePath = join(tempDir, 'fonts-prod-abc123d.tar.gz');
    await writeFile(archivePath, 'archive-content');

    execFileMock.mockReset();
    execFileMock.mockImplementation((...args: unknown[]) => {
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(null);
    });

    defaultOptions = {
      repositoryUrl: 'https://gitlab.infomaniak.ch/infomaniak/fonts-delivery.git',
      repositoryToken: 'glpat-token',
      archivePath,
      archiveName: 'fonts-prod-abc123d.tar.gz',
      commitMessage: 'chore: publish fonts prod abc123d',
      workDirectory: workDir,
    };
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('clones, copies the archive, commits and pushes', async () => {
    await pushGitlabFontsArchive(defaultOptions);

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
      readFile(join(repoDir, 'archives', 'fonts-prod-abc123d.tar.gz'), { encoding: 'utf8' }),
    ).resolves.toBe('archive-content');
  });

  it('removes previous tar.gz archives before copying the new one', async () => {
    const archivesDir = join(repoDir, 'archives');
    await mkdir(archivesDir, { recursive: true });
    await writeFile(join(archivesDir, 'fonts-dev-old1234.tar.gz'), 'old archive');
    await writeFile(join(archivesDir, 'README.md'), 'keep me');

    await pushGitlabFontsArchive(defaultOptions);

    const fileNames = (await readdir(archivesDir)).sort();
    expect(fileNames).toEqual(['README.md', 'fonts-prod-abc123d.tar.gz']);
  });

  it('rejects with a descriptive error when a git command fails', async () => {
    execFileMock.mockImplementation((...args: unknown[]) => {
      const command = args[1] as string[];
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(command[0] === 'push' ? new Error('push failed') : null);
    });

    await expect(pushGitlabFontsArchive(defaultOptions)).rejects.toThrow(
      'git push origin HEAD failed: push failed',
    );
  });

  it('redacts the repository token from clone failure errors', async () => {
    execFileMock.mockImplementation((...args: unknown[]) => {
      const command = args[1] as string[];
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(
        command[0] === 'clone'
          ? new Error('Command failed: git clone https://oauth2:glpat-token@gitlab.example.com')
          : null,
      );
    });

    const error: unknown = await pushGitlabFontsArchive(defaultOptions).catch(
      (rejected: unknown) => rejected,
    );

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).not.toContain('glpat-token');
    expect((error as Error).message).toContain('git clone --depth 1 https://oauth2:***@');
    expect((error as Error).message).toContain('failed: Command failed: git clone');
  });

  it('leaves error messages intact when the repository token is empty', async () => {
    execFileMock.mockImplementation((...args: unknown[]) => {
      const command = args[1] as string[];
      const callback = args.at(-1) as (error: Error | null) => void;
      callback(command[0] === 'clone' ? new Error('clone failed') : null);
    });

    await expect(
      pushGitlabFontsArchive({ ...defaultOptions, repositoryToken: '' }),
    ).rejects.toThrow(
      'git clone --depth 1 https://oauth2:@gitlab.infomaniak.ch/infomaniak/fonts-delivery.git',
    );
  });
});
