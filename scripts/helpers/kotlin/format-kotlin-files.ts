import type { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';

export interface FormatKotlinFilesOptions {
  readonly cwd: string;
  readonly logger: Logger;
}

export async function formatKotlinFiles({ cwd, logger }: FormatKotlinFilesOptions): Promise<void> {
  await execCommandInherit(
    logger,
    'curl',
    ['-sSLO', 'https://github.com/ktlint/ktlint/releases/latest/download/ktlint'],
    {
      cwd,
    },
  );

  await execCommandInherit(logger, 'chmod', ['a+x', 'ktlint'], {
    cwd,
  });

  await execCommandInherit(logger, './ktlint', ['-F', '**/*.kt'], {
    shell: true,
    cwd,
  });
}
