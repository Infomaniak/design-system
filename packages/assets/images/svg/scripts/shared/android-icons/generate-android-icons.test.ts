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

const STROKED_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9V13" stroke="black" stroke-width="1.75"/></svg>`;

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
        async ({
          outputDirectory,
          nestedPackName,
        }: ConvertSvgsToImageVectorsOptions): Promise<void> => {
          const nestedPackDirectory: string = join(outputDirectory, nestedPackName.toLowerCase());
          await mkdir(nestedPackDirectory, { recursive: true });
          await writeFile(
            join(nestedPackDirectory, 'Check.kt'),
            'package p\n\nimport a.B\n\nval x = 1\n',
            'utf8',
          );
        },
      );
  });

  afterEach(async () => {
    await rm(tempDir, { force: true, recursive: true });
  });

  test('wipes the output then writes optimized SVGs and previewed ImageVectors per size', async () => {
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
    ).toEqual(['Large.Check', 'Medium.Check', 'Small.Check', 'XLarge.Check', 'XSmall.Check']);

    await expect(stat(join(outputDirectory, 'stale.txt'))).rejects.toThrow();
    expect((await readdir(join(outputDirectory, 'svgs'))).sort()).toEqual([
      'large',
      'medium',
      'small',
      'xlarge',
      'xsmall',
    ]);
    expect(await readFile(join(outputDirectory, 'svgs', 'xsmall', 'check.svg'), 'utf8')).toContain(
      'stroke-width="2.25"',
    );
    expect(installValkyrieCliMock).toHaveBeenCalledExactlyOnceWith({
      installDirectory: join(tempDir, 'cache'),
      logger,
    });
    expect(convertSvgsToImageVectorsMock).toHaveBeenCalledTimes(5);
    expect(convertSvgsToImageVectorsMock).toHaveBeenCalledWith({
      valkyrieCliJarPath: '/cli/valkyrie.jar',
      svgsDirectory: join(outputDirectory, 'svgs', 'medium'),
      outputDirectory: join(outputDirectory, 'kt'),
      nestedPackName: 'Medium',
      logger,
    });
    expect(await readFile(join(outputDirectory, 'kt', 'medium', 'Check.kt'), 'utf8')).toContain(
      'imageVector = EsdsIcons.Medium.Check,',
    );
  });
});
