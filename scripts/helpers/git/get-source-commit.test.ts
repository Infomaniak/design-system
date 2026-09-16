import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Logger } from '../log/logger.ts';
import { execCommand } from '../misc/exec-command.ts';
import { getSourceCommit } from './get-source-commit.ts';

vi.mock('../misc/exec-command.ts');

const logger = Logger.never();
const execCommandMock = vi.mocked(execCommand);

describe('getSourceCommit', () => {
  beforeEach(() => {
    vi.stubEnv('GITHUB_SHA', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    execCommandMock.mockReset();
  });

  it('uses the GitHub workflow source commit when available', async () => {
    const commit = 'ABCDEF1234567890ABCDEF1234567890ABCDEF12';
    vi.stubEnv('GITHUB_SHA', commit);

    await expect(getSourceCommit(logger, '/repository')).resolves.toBe(commit.toLowerCase());
    expect(execCommandMock).not.toHaveBeenCalled();
  });

  it('returns the trimmed full HEAD commit', async () => {
    const commit = 'abcdef1234567890abcdef1234567890abcdef12';
    execCommandMock.mockResolvedValue(`${commit}\n`);

    await expect(getSourceCommit(logger, '/repository')).resolves.toBe(commit);
    expect(execCommandMock).toHaveBeenCalledExactlyOnceWith(logger, 'git', ['rev-parse', 'HEAD'], {
      cwd: '/repository',
    });
  });

  it('fails when Git returns an empty commit', async () => {
    execCommandMock.mockResolvedValue('');

    await expect(getSourceCommit(logger, '/repository')).rejects.toThrow(
      'Unable to resolve the full Git commit in /repository.',
    );
  });

  it('rejects an invalid GitHub workflow source commit', async () => {
    vi.stubEnv('GITHUB_SHA', 'invalid');

    await expect(getSourceCommit(logger, '/repository')).rejects.toThrow(
      'GITHUB_SHA must be a full Git commit hash.',
    );
    expect(execCommandMock).not.toHaveBeenCalled();
  });
});
