import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { Logger } from '../log/logger.ts';
import { gitChanges } from './git-changes.ts';

describe('gitChanges', () => {
  it('should return all created, updated, and deleted changes of the last commit', async () => {
    const repositoryDirectory: string = await createTemporaryGitRepository();

    try {
      await writeFiles(repositoryDirectory, {
        'a.txt': 'a content v1',
        'b.txt': 'b content',
        'c.txt': 'c content',
      });
      commitAll(repositoryDirectory, 'commit 1: create a, b, c');

      await writeFile(join(repositoryDirectory, 'a.txt'), 'a content v2');
      await writeFile(join(repositoryDirectory, 'd.txt'), 'd content');
      await rm(join(repositoryDirectory, 'b.txt'));
      commitAll(repositoryDirectory, 'commit 2: update a, create d, delete b');

      expect(
        await gitChanges({
          logger: Logger.never(),
          cwd: repositoryDirectory,
        }),
      ).toEqual([
        { mode: 'update', file: 'a.txt' },
        { mode: 'delete', file: 'b.txt' },
        { mode: 'create', file: 'd.txt' },
      ]);
    } finally {
      await rm(repositoryDirectory, { recursive: true, force: true });
    }
  });

  it('should return no changes for an empty commit', async () => {
    const repositoryDirectory: string = await createTemporaryGitRepository();

    try {
      await writeFiles(repositoryDirectory, { 'a.txt': 'content' });
      commitAll(repositoryDirectory, 'commit 1: create a');

      runGit(repositoryDirectory, ['commit', '--allow-empty', '-m', 'commit 2: empty']);

      expect(
        await gitChanges({
          logger: Logger.never(),
          cwd: repositoryDirectory,
        }),
      ).toEqual([]);
    } finally {
      await rm(repositoryDirectory, { recursive: true, force: true });
    }
  });

  it('should warn and ignore unknown diff lines', async () => {
    const repositoryDirectory: string = await createTemporaryGitRepository();
    const logger: Logger = Logger.never();
    const warnSpy = vi.spyOn(logger, 'warn');

    try {
      await writeFiles(repositoryDirectory, {
        'link.txt': 'content',
        'target.txt': 'target content',
      });
      commitAll(repositoryDirectory, 'commit 1: create link and target');

      await rm(join(repositoryDirectory, 'link.txt'));
      await symlink('target.txt', join(repositoryDirectory, 'link.txt'));
      commitAll(repositoryDirectory, 'commit 2: replace link with a symlink');

      expect(await gitChanges({ logger, cwd: repositoryDirectory })).toEqual([]);
      expect(warnSpy).toHaveBeenCalledExactlyOnceWith('Unknown git diff line: T\tlink.txt');
    } finally {
      await rm(repositoryDirectory, { recursive: true, force: true });
    }
  });

  it('should return a rename as a delete and a create', async () => {
    const repositoryDirectory: string = await createTemporaryGitRepository();

    try {
      await writeFiles(repositoryDirectory, { 'old.txt': 'content' });
      commitAll(repositoryDirectory, 'commit 1: create old');

      runGit(repositoryDirectory, ['mv', 'old.txt', 'new.txt']);
      commitAll(repositoryDirectory, 'commit 2: rename old to new');

      expect(
        await gitChanges({
          logger: Logger.never(),
          cwd: repositoryDirectory,
        }),
      ).toEqual([
        { mode: 'create', file: 'new.txt' },
        { mode: 'delete', file: 'old.txt' },
      ]);
    } finally {
      await rm(repositoryDirectory, { recursive: true, force: true });
    }
  });
});

function runGit(repositoryDirectory: string, args: readonly string[]): void {
  execFileSync('git', ['-C', repositoryDirectory, ...args], { stdio: 'pipe' });
}

async function createTemporaryGitRepository(): Promise<string> {
  const repositoryDirectory: string = await mkdtemp(join(tmpdir(), 'git-changes-test-'));

  runGit(repositoryDirectory, ['init']);
  runGit(repositoryDirectory, ['config', 'user.email', 'test@test.local']);
  runGit(repositoryDirectory, ['config', 'user.name', 'Test']);

  return repositoryDirectory;
}

async function writeFiles(
  repositoryDirectory: string,
  fileEntryNameToContent: Readonly<Record<string, string>>,
): Promise<void> {
  for (const [entryName, content] of Object.entries(fileEntryNameToContent)) {
    await writeFile(join(repositoryDirectory, entryName), content);
  }
}

function commitAll(repositoryDirectory: string, message: string): void {
  runGit(repositoryDirectory, ['add', '-A']);
  runGit(repositoryDirectory, ['commit', '-m', message]);
}
