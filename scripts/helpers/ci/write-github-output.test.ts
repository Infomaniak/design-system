import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { Logger } from '../log/logger.ts';
import { writeGithubOutput } from './write-github-output.ts';

describe('writeGithubOutput', () => {
  it('writes output line to provided output path', async () => {
    const logger = Logger.root();
    const directory: string = await mkdtemp(join(tmpdir(), 'github-output-'));
    const outputPath: string = join(directory, 'output.txt');

    await writeGithubOutput({
      logger,
      name: 'should_deploy',
      outputPath,
      value: 'true',
    });

    await expect(readFile(outputPath, { encoding: 'utf8' })).resolves.toBe('should_deploy=true\n');
  });

  it('does nothing when output path is missing', async () => {
    const logger = Logger.root();

    await expect(
      writeGithubOutput({
        logger,
        name: 'should_deploy',
        outputPath: '',
        value: 'true',
      }),
    ).resolves.toBeUndefined();
  });
});
