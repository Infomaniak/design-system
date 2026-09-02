import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PackageJson } from '../../../../../../../../scripts/helpers/file/package-json/package-json.ts';
import { readPackageJsonFile } from '../../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts';
import type { GitChanges } from '../../../../../../../../scripts/helpers/git/git-changes.ts';
import type { GithubCiPullRequest } from '../../../../../../../../scripts/helpers/github/github-ci-config/github-ci-config.ts';
import { createGithubPullRequest } from '../../../../../../../../scripts/helpers/github/pull-request/create-github-pull-request.ts';
import { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import type { SymbolIcon } from '../../../shared/sf-symbols/build-symbols-xcassets.ts';
import { generateSfSymbols } from '../../../shared/sf-symbols/generate-sf-symbols.ts';
import { SYMBOLS_XCASSETS_DIRECTORY_NAME } from '../../../shared/sf-symbols/sf-symbols-config.ts';
import { createIosSymbolsPublishGithubBranch } from './create-ios-symbols-publish-github-branch.ts';
import { publishSfSymbols, type PublishSfSymbolsOptions } from './publish-sf-symbols.ts';

vi.mock('./create-ios-symbols-publish-github-branch.ts');
vi.mock('../../../shared/sf-symbols/generate-sf-symbols.ts');
vi.mock(
  '../../../../../../../../scripts/helpers/github/pull-request/create-github-pull-request.ts',
);
vi.mock('../../../../../../../../scripts/helpers/file/package-json/read-package-json-file.ts');

const logger = Logger.never();

const createIosSymbolsPublishGithubBranchMock = vi.mocked(createIosSymbolsPublishGithubBranch);
const generateSfSymbolsMock = vi.mocked(generateSfSymbols);
const createGithubPullRequestMock = vi.mocked(createGithubPullRequest);
const readPackageJsonFileMock = vi.mocked(readPackageJsonFile);

describe('publishSfSymbols', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'publish-sf-symbols-'));

    createIosSymbolsPublishGithubBranchMock.mockReset();
    generateSfSymbolsMock.mockReset();
    createGithubPullRequestMock.mockReset();
    readPackageJsonFileMock.mockReset();

    generateSfSymbolsMock.mockResolvedValue([] satisfies readonly SymbolIcon[]);
    readPackageJsonFileMock.mockResolvedValue({ name: 'x', version: '1.2.3' } as PackageJson);
    createGithubPullRequestMock.mockResolvedValue({} as GithubCiPullRequest);
    vi.stubEnv('CI_PULL_REQUEST_AUTH_TOKEN_MOBILE', 'test-token');
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    await rm(tempDir, { force: true, recursive: true });
  });

  const createPublishOptions = (mode: 'dev' | 'prod'): PublishSfSymbolsOptions => {
    const outlinesDirectory: string = join(tempDir, 'outlines');
    const webIconsDirectory: string = join(tempDir, 'icons');
    const outputDirectory: string = join(tempDir, 'dist', 'sf-symbols');

    return {
      ...(mode === 'dev' ? { mode, prerelease: '42' } : { mode }),
      packageRootDirectory: tempDir,
      outputDirectory,
      outlinesDirectory,
      webIconsDirectory,
      logger,
    };
  };

  const writeOutlineFile = async (outlinesDirectory: string): Promise<void> => {
    await mkdir(outlinesDirectory, { recursive: true });
    await writeFile(join(outlinesDirectory, 'magnifying-glass.outline.svg'), '<svg/>', {
      encoding: 'utf8',
    });
  };

  it('skips when the outlines directory does not exist', async () => {
    const options = createPublishOptions('dev');

    await publishSfSymbols(options);

    expect(generateSfSymbolsMock).not.toHaveBeenCalled();
    expect(createIosSymbolsPublishGithubBranchMock).not.toHaveBeenCalled();
    expect(createGithubPullRequestMock).not.toHaveBeenCalled();
  });

  it('skips when the outlines directory contains no outline file', async () => {
    const options = createPublishOptions('dev');
    await mkdir(options.outlinesDirectory, { recursive: true });
    await writeFile(join(options.outlinesDirectory, 'readme.md'), 'ignored', {
      encoding: 'utf8',
    });

    await publishSfSymbols(options);

    expect(generateSfSymbolsMock).not.toHaveBeenCalled();
    expect(createIosSymbolsPublishGithubBranchMock).not.toHaveBeenCalled();
    expect(createGithubPullRequestMock).not.toHaveBeenCalled();
  });

  it('rethrows unexpected directory read errors', async () => {
    const filePath: string = join(tempDir, 'file.txt');
    await writeFile(filePath, 'a file, not a directory', { encoding: 'utf8' });
    const options = createPublishOptions('dev');
    (options as { outlinesDirectory: string }).outlinesDirectory = filePath;

    await expect(publishSfSymbols(options)).rejects.toThrow();
    expect(generateSfSymbolsMock).not.toHaveBeenCalled();
  });

  it('generates, pushes the branch and opens a pull request (dev mode)', async () => {
    const options = createPublishOptions('dev');
    await writeOutlineFile(options.outlinesDirectory);
    createIosSymbolsPublishGithubBranchMock.mockResolvedValue([
      { mode: 'create', file: 'Sources/ESDSSymbols/Symbols.xcassets' },
    ] satisfies GitChanges);

    await publishSfSymbols(options);

    expect(generateSfSymbolsMock).toHaveBeenCalledWith({
      outputDirectory: options.outputDirectory,
      outlinesDirectory: options.outlinesDirectory,
      webIconsDirectory: options.webIconsDirectory,
      logger,
    });
    expect(createIosSymbolsPublishGithubBranchMock).toHaveBeenCalledWith({
      logger,
      xcassetsDirectory: join(options.outputDirectory, SYMBOLS_XCASSETS_DIRECTORY_NAME),
      version: '1.2.3-dev.42',
      branchName: 'esds-symbols/1.2.3-dev.42',
    });
    expect(createGithubPullRequestMock).toHaveBeenCalledWith({
      owner: 'Infomaniak',
      repository: 'ios-design-system',
      authToken: 'test-token',
      title: 'chore: Update symbols to 1.2.3-dev.42',
      body: 'chore: Update symbols to 1.2.3-dev.42',
      head: 'esds-symbols/1.2.3-dev.42',
      base: 'main',
    });
  });

  it('uses the package version as-is in prod mode', async () => {
    const options = createPublishOptions('prod');
    await writeOutlineFile(options.outlinesDirectory);
    createIosSymbolsPublishGithubBranchMock.mockResolvedValue([
      { mode: 'create', file: 'Sources/ESDSSymbols/Symbols.xcassets' },
    ] satisfies GitChanges);

    await publishSfSymbols(options);

    expect(createIosSymbolsPublishGithubBranchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        version: '1.2.3',
        branchName: 'esds-symbols/1.2.3',
      }),
    );
    expect(createGithubPullRequestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'chore: Update symbols to 1.2.3',
        head: 'esds-symbols/1.2.3',
      }),
    );
  });

  it('skips the pull request when the pushed branch has no changes', async () => {
    const options = createPublishOptions('dev');
    await writeOutlineFile(options.outlinesDirectory);
    createIosSymbolsPublishGithubBranchMock.mockResolvedValue([] satisfies GitChanges);

    await publishSfSymbols(options);

    expect(createIosSymbolsPublishGithubBranchMock).toHaveBeenCalledOnce();
    expect(createGithubPullRequestMock).not.toHaveBeenCalled();
  });
});
