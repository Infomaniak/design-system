import { mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { generateAndroidIcons } from './generate-android-icons.ts';
import {
  convertSvgsToImageVectors,
  type ConvertSvgsToImageVectorsOptions,
  installValkyrieCli,
} from './valkyrie-cli.ts';

vi.mock('./valkyrie-cli.ts');

const logger = Logger.never();

const installValkyrieCliMock = vi.mocked(installValkyrieCli);
const convertSvgsToImageVectorsMock = vi.mocked(convertSvgsToImageVectors);

const STROKED_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9V13" stroke="black"/></svg>`;

describe('generateAndroidIcons', () => {
  let tempDir: string;
  let sourceDirectory: string;
  let outputDirectory: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'generate-android-icons-'));
    sourceDirectory = join(tempDir, 'figma');
    outputDirectory = join(tempDir, 'dist', 'android', 'icons');
    await mkdir(sourceDirectory, { recursive: true });

    installValkyrieCliMock.mockReset().mockResolvedValue('/cli/valkyrie.jar');
    convertSvgsToImageVectorsMock
      .mockReset()
      .mockImplementation(
        async ({ outputDirectory }: ConvertSvgsToImageVectorsOptions): Promise<void> => {
          await mkdir(outputDirectory, { recursive: true });
          await writeFile(
            join(outputDirectory, 'Check.kt'),
            'package p\n\nimport a.B\n\nval x = 1\n',
            'utf8',
          );
        },
      );
  });

  afterEach(async () => {
    await rm(tempDir, { force: true, recursive: true });
  });

  test('wipes the output then writes optimized SVGs and previewed ImageVectors', async () => {
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(join(outputDirectory, 'stale.txt'), 'stale', 'utf8');
    await writeFile(join(sourceDirectory, 'check.svg'), STROKED_ICON, 'utf8');

    expect(
      await generateAndroidIcons({
        sourceDirectory,
        outputDirectory,
        valkyrieCliInstallDirectory: join(tempDir, 'cache'),
        logger,
      }),
    ).toEqual(['Check']);

    await expect(stat(join(outputDirectory, 'stale.txt'))).rejects.toThrow();
    expect(await readdir(join(outputDirectory, 'svgs'))).toEqual(['check.svg']);
    expect(installValkyrieCliMock).toHaveBeenCalledExactlyOnceWith({
      installDirectory: join(tempDir, 'cache'),
      logger,
    });
    expect(convertSvgsToImageVectorsMock).toHaveBeenCalledExactlyOnceWith({
      valkyrieCliJarPath: '/cli/valkyrie.jar',
      svgsDirectory: join(outputDirectory, 'svgs'),
      outputDirectory: join(outputDirectory, 'kt'),
      logger,
    });
    expect(await readFile(join(outputDirectory, 'kt', 'Check.kt'), 'utf8')).toContain(
      'private fun Preview()',
    );
  });
});
