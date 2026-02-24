import { appendFile } from 'node:fs/promises';
import { type Logger } from '../log/logger.ts';

export interface WriteGithubOutputOptions {
  readonly logger: Logger;
  readonly name: string;
  readonly value: string;
  readonly outputPath?: string;
}

export async function writeGithubOutput({
  logger,
  name,
  outputPath = process.env['GITHUB_OUTPUT'],
  value,
}: WriteGithubOutputOptions): Promise<void> {
  if (outputPath === undefined || outputPath === '') {
    logger.warn(`Skipping output ${name}: GITHUB_OUTPUT is not available.`);
    return;
  }

  await appendFile(outputPath, `${name}=${value}\n`, { encoding: 'utf8' });
}
