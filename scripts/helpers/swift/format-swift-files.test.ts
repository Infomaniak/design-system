import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';
import { formatSwiftFiles } from './format-swift-files.ts';

vi.mock('../misc/exec-command.ts');

const logger = Logger.never();
const execCommandInheritMock = vi.mocked(execCommandInherit);

describe('formatSwiftFiles', () => {
  beforeEach(() => {
    execCommandInheritMock.mockReset();
    execCommandInheritMock.mockResolvedValue('');
  });

  it('installs the configured tools and formats the requested paths', async () => {
    await formatSwiftFiles({
      logger,
      cwd: '/repository',
      paths: ['Sources/ESDSSymbols/ESDSSymbols.swift'],
    });

    expect(execCommandInheritMock).toHaveBeenNthCalledWith(1, logger, 'mise', ['install'], {
      shell: true,
      cwd: '/repository',
    });
    expect(execCommandInheritMock).toHaveBeenNthCalledWith(
      2,
      logger,
      'mise',
      ['exec', '--', 'swiftformat', 'Sources/ESDSSymbols/ESDSSymbols.swift'],
      {
        shell: true,
        cwd: '/repository',
      },
    );
  });
});
