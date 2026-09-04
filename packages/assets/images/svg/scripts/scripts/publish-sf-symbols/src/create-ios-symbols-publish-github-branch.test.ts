import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GitChanges } from '../../../../../../../../scripts/helpers/git/git-changes.ts';
import type {
  UpdateGitRepositoryOnNewBranchOptions,
  UpdateGitRepositoryOnNewBranchUpdateFunctionContext,
} from '../../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { updateGitRepositoryOnNewBranch } from '../../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { IOS_SYMBOLS_DESTINATION_PATH } from '../../../shared/sf-symbols/sf-symbols-config.ts';
import { createIosSymbolsPublishGithubBranch } from './create-ios-symbols-publish-github-branch.ts';

vi.mock('../../../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts');

const logger = Logger.never();

const updateGitRepositoryOnNewBranchMock = vi.mocked(updateGitRepositoryOnNewBranch);

interface RunUpdateResult {
  readonly context: UpdateGitRepositoryOnNewBranchUpdateFunctionContext;
  readonly commitMessage: string;
}

describe('createIosSymbolsPublishGithubBranch', () => {
  let tempDir: string;
  let xcassetsDirectory: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'ios-symbols-publish-'));
    xcassetsDirectory = join(tempDir, 'ESDSSymbols.xcassets');
    await mkdir(join(xcassetsDirectory, 'esds-a-square.symbolset'), { recursive: true });
    await writeFile(join(xcassetsDirectory, 'Contents.json'), '{}', { encoding: 'utf8' });
    await writeFile(
      join(xcassetsDirectory, 'esds-a-square.symbolset', 'esds-a-square.symbol.svg'),
      '<svg/>',
      { encoding: 'utf8' },
    );
  });

  afterEach(async () => {
    updateGitRepositoryOnNewBranchMock.mockReset();
    await rm(tempDir, { force: true, recursive: true });
  });

  const runUpdateInRepository = async (repositoryDirectory: string): Promise<RunUpdateResult> => {
    let result: RunUpdateResult | undefined;

    updateGitRepositoryOnNewBranchMock.mockImplementation(
      async (options: UpdateGitRepositoryOnNewBranchOptions): Promise<GitChanges> => {
        const context: UpdateGitRepositoryOnNewBranchUpdateFunctionContext = {
          repository: options.repository,
          branchName: options.branchName,
          cwd: repositoryDirectory,
          logger,
        };
        const commitMessage: string = await options.update(context);

        result = { context, commitMessage };

        return [{ mode: 'create', file: 'Sources/ESDSSymbols/Symbols.xcassets' }];
      },
    );

    const changes: GitChanges = await createIosSymbolsPublishGithubBranch({
      logger,
      xcassetsDirectory,
      version: '1.2.3',
      branchName: 'esds-symbols/1.2.3',
    });

    expect(changes).toEqual([{ mode: 'create', file: 'Sources/ESDSSymbols/Symbols.xcassets' }]);
    expect(updateGitRepositoryOnNewBranchMock).toHaveBeenCalledOnce();

    const options: UpdateGitRepositoryOnNewBranchOptions =
      updateGitRepositoryOnNewBranchMock.mock.calls[0]![0]!;
    expect(options.repository).toBe('git@ios-design-system:Infomaniak/ios-design-system.git');
    expect(options.branchName).toBe('esds-symbols/1.2.3');
    expect(options.allowEmpty).toBe('yes-skip-push');

    return result!;
  };

  it('replaces the destination asset catalog and returns the commit message', async () => {
    const repositoryDirectory: string = join(tempDir, 'repository');
    const destinationDirectory: string = join(repositoryDirectory, IOS_SYMBOLS_DESTINATION_PATH);
    await mkdir(join(destinationDirectory, 'stale-esds-icon.symbolset'), { recursive: true });
    await writeFile(join(destinationDirectory, 'stale.txt'), 'stale', { encoding: 'utf8' });

    const { commitMessage } = await runUpdateInRepository(repositoryDirectory);

    expect(commitMessage).toBe('chore: Update symbols to 1.2.3');
    expect(
      await readFile(
        join(destinationDirectory, 'esds-a-square.symbolset', 'esds-a-square.symbol.svg'),
        'utf8',
      ),
    ).toBe('<svg/>');
    await expect(stat(join(destinationDirectory, 'stale.txt'))).rejects.toThrow();
  });

  it('creates the destination directories when missing', async () => {
    const repositoryDirectory: string = join(tempDir, 'empty-repository');
    await mkdir(repositoryDirectory, { recursive: true });

    await runUpdateInRepository(repositoryDirectory);

    const destinationDirectory: string = join(repositoryDirectory, IOS_SYMBOLS_DESTINATION_PATH);
    const destinationStats = await stat(destinationDirectory);
    expect(destinationStats.isDirectory()).toBe(true);
  });
});
