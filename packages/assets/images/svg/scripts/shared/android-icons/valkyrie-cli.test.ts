import { mkdir, mkdtemp, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { execCommandInherit } from '../../../../../../../scripts/helpers/misc/exec-command.ts';
import {
  convertSvgsToImageVectors,
  installValkyrieCli,
  VALKYRIE_CLI_VERSION,
} from './valkyrie-cli.ts';

vi.mock('../../../../../../../scripts/helpers/misc/exec-command.ts');

const logger = Logger.never();

const execCommandInheritMock = vi.mocked(execCommandInherit);

const JAR_RELATIVE_PATH = `lib/valkyrie-${VALKYRIE_CLI_VERSION}-all.jar`;

describe('installValkyrieCli', () => {
  let installDirectory: string;

  beforeEach(async () => {
    installDirectory = join(await mkdtemp(join(tmpdir(), 'valkyrie-cli-')), 'cache');
    execCommandInheritMock.mockReset();
  });

  afterEach(async () => {
    await rm(join(installDirectory, '..'), { force: true, recursive: true });
  });

  test('downloads and extracts the CLI archive then removes it', async () => {
    const archivePath: string = join(installDirectory, 'valkyrie-cli.zip');
    execCommandInheritMock.mockImplementation(async (_logger, command): Promise<string> => {
      if (command === 'curl') {
        await writeFile(archivePath, 'zip', 'utf8');
      }
      return '';
    });

    expect(await installValkyrieCli({ installDirectory, logger })).toBe(
      join(installDirectory, JAR_RELATIVE_PATH),
    );
    expect(execCommandInheritMock.mock.calls.map((call) => call.slice(1))).toEqual([
      [
        'curl',
        [
          '-sSL',
          '-o',
          archivePath,
          `https://github.com/ComposeGears/Valkyrie/releases/download/cli-${VALKYRIE_CLI_VERSION}/valkyrie-cli-${VALKYRIE_CLI_VERSION}.zip`,
        ],
      ],
      ['unzip', ['-oq', archivePath, '-d', installDirectory]],
    ]);
    await expect(stat(archivePath)).rejects.toThrow();
  });

  test('reuses an already installed CLI', async () => {
    await mkdir(join(installDirectory, 'lib'), { recursive: true });
    await writeFile(join(installDirectory, JAR_RELATIVE_PATH), 'jar', 'utf8');

    expect(await installValkyrieCli({ installDirectory, logger })).toBe(
      join(installDirectory, JAR_RELATIVE_PATH),
    );
    expect(execCommandInheritMock).not.toHaveBeenCalled();
  });
});

describe('convertSvgsToImageVectors', () => {
  beforeEach(() => {
    execCommandInheritMock.mockReset();
  });

  test('runs Valkyrie with the EsdsIcons pack in the imagevector package', async () => {
    await convertSvgsToImageVectors({
      valkyrieCliJarPath: '/cli/valkyrie.jar',
      svgsDirectory: '/dist/svgs',
      outputDirectory: '/dist/kt',
      logger,
    });

    expect(execCommandInheritMock).toHaveBeenCalledExactlyOnceWith(logger, 'java', [
      '-jar',
      '/cli/valkyrie.jar',
      'svgxml2imagevector',
      '--input-path=/dist/svgs',
      '--output-path=/dist/kt',
      '--package-name=com.infomaniak.designsystem.icons.imagevector',
      '--iconpack-name=EsdsIcons',
      '--explicit-mode=true',
      '--trailing-comma=true',
    ]);
  });
});
