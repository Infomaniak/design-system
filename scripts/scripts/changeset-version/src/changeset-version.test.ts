import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { writeTextFileSafe } from '../../../helpers/file/write-text-file-safe.ts';
import { Logger } from '../../../helpers/log/logger.ts';
import { execCommandInherit } from '../../../helpers/misc/exec-command.ts';
import {
  listChangesetFiles,
  runChangesetVersion,
  stampNewVersionHeadings,
} from './changeset-version.ts';

vi.mock('../../../helpers/misc/exec-command.ts');

const execCommandInheritMock = vi.mocked(execCommandInherit);

const featTokensChangeset: string = '---\n"@infomaniak-design-system/tokens": minor\n---';

describe('listChangesetFiles', () => {
  it('returns only unreleased changeset files, sorted by name', async () => {
    const changesetDirectory: string = await createTemporaryDirectory({
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
    const changesetDirectory: string = await createTemporaryDirectory({
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

describe('stampNewVersionHeadings', () => {
  it('adds the date to new version headings only, leaving previous and already dated ones untouched', () => {
    const previousContent: string = [
      '# Changelog',
      '',
      '## 0.6.1',
      '',
      '## 0.6.0 (2026-09-01)',
      '',
    ].join('\n');

    const currentContent: string = [
      '# Changelog',
      '',
      '## 0.7.0',
      '',
      '## 1.0.0-beta.1',
      '',
      '## 0.6.1',
      '',
      '## 0.6.0 (2026-09-01)',
      '',
    ].join('\n');

    expect(stampNewVersionHeadings({ previousContent, currentContent, date: '2026-10-12' })).toBe(
      [
        '# Changelog',
        '',
        '## 0.7.0 (2026-10-12)',
        '',
        '## 1.0.0-beta.1 (2026-10-12)',
        '',
        '## 0.6.1',
        '',
        '## 0.6.0 (2026-09-01)',
        '',
      ].join('\n'),
    );
  });
});

describe('runChangesetVersion', () => {
  let changesetDirectory: string;
  let packagesDirectory: string;

  beforeEach(async (): Promise<void> => {
    execCommandInheritMock.mockReset();
    vi.useFakeTimers({ now: new Date('2026-10-12T23:59:59.000Z') });

    changesetDirectory = await mkdtemp(join(tmpdir(), 'changeset-version-test-'));
    packagesDirectory = await mkdtemp(join(tmpdir(), 'changeset-version-test-'));
  });

  afterEach(async (): Promise<void> => {
    vi.useRealTimers();

    await rm(changesetDirectory, { recursive: true, force: true });
    await rm(packagesDirectory, { recursive: true, force: true });
  });

  it('skips changeset version when there is no unreleased changeset', async () => {
    const logger: Logger = Logger.never();

    expect(await runChangesetVersion({ changesetDirectory, packagesDirectory, logger })).toBe(
      false,
    );

    expect(execCommandInheritMock).not.toHaveBeenCalled();
  });

  it('runs yarn changeset version and stamps new version headings with the current UTC date', async () => {
    await writeTextFileSafe(join(changesetDirectory, 'feat-tokens.md'), featTokensChangeset);
    await writeTextFileSafe(
      join(packagesDirectory, 'tokens/CHANGELOG.md'),
      '# Changelog\n\n## 0.6.1\n',
    );
    await writeTextFileSafe(
      join(packagesDirectory, 'components/CHANGELOG.md'),
      '# Changelog\n\n## 1.2.3\n',
    );
    const logger: Logger = Logger.never();

    execCommandInheritMock.mockImplementation(async (): Promise<string> => {
      await writeFile(
        join(packagesDirectory, 'tokens/CHANGELOG.md'),
        '# Changelog\n\n## 0.7.0\n\n## 0.6.1\n',
      );

      return '';
    });

    expect(await runChangesetVersion({ changesetDirectory, packagesDirectory, logger })).toBe(true);

    expect(await readFile(join(packagesDirectory, 'tokens/CHANGELOG.md'), 'utf8')).toBe(
      '# Changelog\n\n## 0.7.0 (2026-10-12)\n\n## 0.6.1\n',
    );

    expect(await readFile(join(packagesDirectory, 'components/CHANGELOG.md'), 'utf8')).toBe(
      '# Changelog\n\n## 1.2.3\n',
    );

    expect(execCommandInheritMock).toHaveBeenCalledExactlyOnceWith(logger, 'yarn', [
      'changeset',
      'version',
    ]);
  });

  it('stamps a changelog file created by the version bump', async () => {
    await writeTextFileSafe(join(changesetDirectory, 'feat-tokens.md'), featTokensChangeset);
    await writeTextFileSafe(
      join(packagesDirectory, 'components/CHANGELOG.md'),
      '# Changelog\n\n## 1.2.3\n',
    );
    const logger: Logger = Logger.never();

    execCommandInheritMock.mockImplementation(async (): Promise<string> => {
      const tokensDirectory: string = join(packagesDirectory, 'tokens');

      await mkdir(tokensDirectory, { recursive: true });
      await writeFile(
        join(tokensDirectory, 'CHANGELOG.md'),
        '# @infomaniak-design-system/tokens\n\n## 0.1.0\n\n### Minor Changes\n\n- First entry.\n',
      );

      return '';
    });

    expect(await runChangesetVersion({ changesetDirectory, packagesDirectory, logger })).toBe(true);

    expect(await readFile(join(packagesDirectory, 'tokens/CHANGELOG.md'), 'utf8')).toBe(
      '# @infomaniak-design-system/tokens\n\n## 0.1.0 (2026-10-12)\n\n### Minor Changes\n\n- First entry.\n',
    );

    expect(await readFile(join(packagesDirectory, 'components/CHANGELOG.md'), 'utf8')).toBe(
      '# Changelog\n\n## 1.2.3\n',
    );
  });

  it('skips changelog files that disappear during the version bump', async () => {
    await writeTextFileSafe(join(changesetDirectory, 'feat-tokens.md'), featTokensChangeset);
    await writeTextFileSafe(
      join(packagesDirectory, 'tokens/CHANGELOG.md'),
      '# Changelog\n\n## 0.6.1\n',
    );
    await writeTextFileSafe(
      join(packagesDirectory, 'components/CHANGELOG.md'),
      '# Changelog\n\n## 1.2.3\n',
    );
    const logger: Logger = Logger.never();

    execCommandInheritMock.mockImplementation(async (): Promise<string> => {
      await rm(join(packagesDirectory, 'tokens/CHANGELOG.md'));
      await writeFile(
        join(packagesDirectory, 'components/CHANGELOG.md'),
        '# Changelog\n\n## 1.3.0\n\n## 1.2.3\n',
      );

      return '';
    });

    await expect(
      runChangesetVersion({ changesetDirectory, packagesDirectory, logger }),
    ).resolves.toBe(true);

    expect(await readFile(join(packagesDirectory, 'components/CHANGELOG.md'), 'utf8')).toBe(
      '# Changelog\n\n## 1.3.0 (2026-10-12)\n\n## 1.2.3\n',
    );
  });

  it('does not fail when a changelog file cannot be read', async () => {
    await writeTextFileSafe(join(changesetDirectory, 'feat-tokens.md'), featTokensChangeset);
    await writeTextFileSafe(
      join(packagesDirectory, 'tokens/CHANGELOG.md'),
      '# Changelog\n\n## 0.6.1\n',
    );
    await writeTextFileSafe(
      join(packagesDirectory, 'components/CHANGELOG.md'),
      '# Changelog\n\n## 1.2.3\n',
    );
    const logger: Logger = Logger.never();

    execCommandInheritMock.mockImplementation(async (): Promise<string> => {
      await chmod(join(packagesDirectory, 'tokens/CHANGELOG.md'), 0o000);
      await writeFile(
        join(packagesDirectory, 'components/CHANGELOG.md'),
        '# Changelog\n\n## 1.3.0\n\n## 1.2.3\n',
      );

      return '';
    });

    await expect(
      runChangesetVersion({ changesetDirectory, packagesDirectory, logger }),
    ).resolves.toBe(true);

    expect(await readFile(join(packagesDirectory, 'components/CHANGELOG.md'), 'utf8')).toBe(
      '# Changelog\n\n## 1.3.0 (2026-10-12)\n\n## 1.2.3\n',
    );
  });
});

async function createTemporaryDirectory(
  relativePathToContent: Readonly<Record<string, string>>,
): Promise<string> {
  const directoryPath: string = await mkdtemp(join(tmpdir(), 'changeset-version-test-'));

  for (const [relativePath, content] of Object.entries(relativePathToContent)) {
    await writeTextFileSafe(join(directoryPath, relativePath), content);
  }

  return directoryPath;
}
