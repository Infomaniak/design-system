import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createIosSymbolsPublishGithubBranch } from '../../../../../../packages/assets/images/svg/scripts/scripts/publish-sf-symbols/src/create-ios-symbols-publish-github-branch.ts';
import { SYMBOLS_SWIFT_FILE_NAME } from '../../../../../../packages/assets/images/svg/scripts/shared/sf-symbols/sf-symbols-config.ts';
import type { GitChanges } from '../../../../../../scripts/helpers/git/git-changes.ts';
import type {
  UpdateGitRepositoryOnNewBranchOptions,
  UpdateGitRepositoryOnNewBranchUpdateFunctionContext,
} from '../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { updateGitRepositoryOnNewBranch } from '../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts';
import { Logger } from '../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../scripts/helpers/misc/exec-command.ts';
import { createAndroidPublishGithubBranch } from './android/create-android-publish-github-branch.ts';
import { createIosPublishGithubBranch } from './ios/create-ios-publish-github-branch.ts';

vi.mock('../../../../../../scripts/helpers/git/update-git-repository-on-new-branch.ts');
vi.mock('../../../../../../scripts/helpers/misc/exec-command.ts');

const logger = Logger.never();
const updateGitRepositoryOnNewBranchMock = vi.mocked(updateGitRepositoryOnNewBranch);
const execCommandInheritMock = vi.mocked(execCommandInherit);
const TOKEN_SOURCE_COMMIT = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const SYMBOL_SOURCE_COMMIT = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

function formatJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

describe('mobile publish branches', () => {
  let tempDir: string;
  let packageDirectory: string;
  let iosRepositoryDirectory: string;
  let androidRepositoryDirectory: string;
  let xcassetsDirectory: string;
  let swiftFile: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'mobile-token-publish-'));
    packageDirectory = join(tempDir, 'package');
    iosRepositoryDirectory = join(tempDir, 'ios-repository');
    androidRepositoryDirectory = join(tempDir, 'android-repository');
    xcassetsDirectory = join(tempDir, 'ESDSSymbols.xcassets');
    swiftFile = join(tempDir, SYMBOLS_SWIFT_FILE_NAME);
    await Promise.all([
      mkdir(packageDirectory, { recursive: true }),
      mkdir(iosRepositoryDirectory, { recursive: true }),
      mkdir(androidRepositoryDirectory, { recursive: true }),
      mkdir(xcassetsDirectory, { recursive: true }),
    ]);
    await writeFile(join(xcassetsDirectory, 'Contents.json'), '{}', 'utf8');
    await writeFile(swiftFile, 'public enum ESDSSymbols {}', 'utf8');

    updateGitRepositoryOnNewBranchMock.mockImplementation(
      async (options: UpdateGitRepositoryOnNewBranchOptions): Promise<GitChanges> => {
        const repositoryDirectory: string = options.repository.includes('android-design-system')
          ? androidRepositoryDirectory
          : iosRepositoryDirectory;
        const context: UpdateGitRepositoryOnNewBranchUpdateFunctionContext = {
          repository: options.repository,
          branchName: options.branchName,
          cwd: repositoryDirectory,
          logger,
        };
        await options.update(context);

        return [];
      },
    );
  });

  afterEach(async () => {
    updateGitRepositoryOnNewBranchMock.mockReset();
    execCommandInheritMock.mockReset();
    await rm(tempDir, { recursive: true, force: true });
  });

  it('publishes the iOS token version as tokens-core', async () => {
    await createIosPublishGithubBranch({
      logger,
      repositoryName: 'ios-design-system',
      packageDirectory,
      version: '1.5.0',
      sourceCommit: TOKEN_SOURCE_COMMIT,
      branchName: 'esds/1.5.0',
    });

    expect(await readFile(join(iosRepositoryDirectory, 'versions.json'), 'utf8')).toBe(
      formatJson({
        schemaVersion: 1,
        'tokens-core': {
          version: '1.5.0',
          sourceCommit: TOKEN_SOURCE_COMMIT,
        },
      }),
    );
  });

  it('publishes only tokens-core on Android', async () => {
    await writeFile(
      join(androidRepositoryDirectory, 'versions.json'),
      '{ "schemaVersion": 1 }\n',
      'utf8',
    );

    await createAndroidPublishGithubBranch({
      logger,
      repositoryName: 'android-design-system',
      packageDirectory,
      version: '1.5.0',
      sourceCommit: TOKEN_SOURCE_COMMIT,
      branchName: 'esds/1.5.0',
    });

    expect(await readFile(join(androidRepositoryDirectory, 'versions.json'), 'utf8')).toBe(
      formatJson({
        schemaVersion: 1,
        'tokens-core': {
          version: '1.5.0',
          sourceCommit: TOKEN_SOURCE_COMMIT,
        },
      }),
    );
  });

  it('tracks iOS tokens, Android tokens, and iOS symbols across publish callbacks', async () => {
    await Promise.all([
      writeFile(join(iosRepositoryDirectory, 'versions.json'), '{ "schemaVersion": 1 }\n', 'utf8'),
      writeFile(
        join(androidRepositoryDirectory, 'versions.json'),
        '{ "schemaVersion": 1 }\n',
        'utf8',
      ),
    ]);

    await createIosPublishGithubBranch({
      logger,
      repositoryName: 'ios-design-system',
      packageDirectory,
      version: '1.5.0',
      sourceCommit: TOKEN_SOURCE_COMMIT,
      branchName: 'esds/1.5.0',
    });
    await createAndroidPublishGithubBranch({
      logger,
      repositoryName: 'android-design-system',
      packageDirectory,
      version: '1.5.0',
      sourceCommit: TOKEN_SOURCE_COMMIT,
      branchName: 'esds/1.5.0',
    });
    await createIosSymbolsPublishGithubBranch({
      logger,
      xcassetsDirectory,
      swiftFile,
      version: '1.0.0',
      sourceCommit: SYMBOL_SOURCE_COMMIT,
      branchName: 'esds-symbols/1.0.0',
    });

    expect(await readFile(join(iosRepositoryDirectory, 'versions.json'), 'utf8')).toBe(
      formatJson({
        schemaVersion: 1,
        'tokens-core': {
          version: '1.5.0',
          sourceCommit: TOKEN_SOURCE_COMMIT,
        },
        symbols: {
          version: '1.0.0',
          sourceCommit: SYMBOL_SOURCE_COMMIT,
        },
      }),
    );
    expect(await readFile(join(androidRepositoryDirectory, 'versions.json'), 'utf8')).toBe(
      formatJson({
        schemaVersion: 1,
        'tokens-core': {
          version: '1.5.0',
          sourceCommit: TOKEN_SOURCE_COMMIT,
        },
      }),
    );
  });
});
