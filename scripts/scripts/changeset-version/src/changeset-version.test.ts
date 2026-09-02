import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Logger } from '../../../helpers/log/logger.ts';
import { execCommandInherit } from '../../../helpers/misc/exec-command.ts';
import { listChangesetFiles, runChangesetVersion } from './changeset-version.ts';

vi.mock('../../../helpers/misc/exec-command.ts');

const execCommandInheritMock = vi.mocked(execCommandInherit);

describe('listChangesetFiles', () => {
  it('returns only unreleased changeset files, sorted by name', async () => {
    const changesetDirectory: string = await createTemporaryChangesetDirectory({
      'README.md': 'documentation',
      'config.json': '{}',
      'fix-components.md': '---\n"@infomaniak-design-system/components": patch\n---',
      'feat-tokens.md': '---\n"@infomaniak-design-system/tokens": minor\n---',
      'ignored.txt': 'not a changeset',
    });

    try {
      expect(await listChangesetFiles({ changesetDirectory })).toEqual([
        {
          name: 'feat-tokens.md',
          path: join(changesetDirectory, 'feat-tokens.md'),
        },
        {
          name: 'fix-components.md',
          path: join(changesetDirectory, 'fix-components.md'),
        },
      ]);
    } finally {
      await rm(changesetDirectory, { recursive: true, force: true });
    }
  });

  it('returns an empty list when the directory only contains setup files', async () => {
    const changesetDirectory: string = await createTemporaryChangesetDirectory({
      'README.md': 'documentation',
      'config.json': '{}',
    });

    try {
      expect(await listChangesetFiles({ changesetDirectory })).toEqual([]);
    } finally {
      await rm(changesetDirectory, { recursive: true, force: true });
    }
  });
});

describe('runChangesetVersion', () => {
  beforeEach(() => {
    execCommandInheritMock.mockReset();
  });

  it('skips changeset version when there is no unreleased changeset', async () => {
    const changesetDirectory: string = await createTemporaryChangesetDirectory({
      'README.md': 'documentation',
      'config.json': '{}',
    });
    const logger: Logger = Logger.never();

    try {
      expect(await runChangesetVersion({ changesetDirectory, logger })).toBe(false);
    } finally {
      await rm(changesetDirectory, { recursive: true, force: true });
    }

    expect(execCommandInheritMock).not.toHaveBeenCalled();
  });

  it('runs yarn changeset version when there are unreleased changesets', async () => {
    const changesetDirectory: string = await createTemporaryChangesetDirectory({
      'fix-components.md': '---\n"@infomaniak-design-system/components": patch\n---',
    });
    const logger: Logger = Logger.never();

    try {
      expect(await runChangesetVersion({ changesetDirectory, logger })).toBe(true);
    } finally {
      await rm(changesetDirectory, { recursive: true, force: true });
    }

    expect(execCommandInheritMock).toHaveBeenCalledExactlyOnceWith(logger, 'yarn', [
      'changeset',
      'version',
    ]);
  });
});

async function createTemporaryChangesetDirectory(
  entryNameToContent: Readonly<Record<string, string>>,
): Promise<string> {
  const changesetDirectory: string = await mkdtemp(join(tmpdir(), 'changeset-version-test-'));

  for (const [entryName, content] of Object.entries(entryNameToContent)) {
    await writeFile(join(changesetDirectory, entryName), content);
  }

  return changesetDirectory;
}
