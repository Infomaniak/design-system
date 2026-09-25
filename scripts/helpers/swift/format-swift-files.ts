import type { Logger } from '../log/logger.ts';
import { execCommandInherit } from '../misc/exec-command.ts';

export interface FormatSwiftFilesOptions {
  readonly logger: Logger;
  readonly cwd: string;
  readonly paths: readonly string[];
}

export async function formatSwiftFiles({
  logger,
  cwd,
  paths,
}: FormatSwiftFilesOptions): Promise<void> {
  await execCommandInherit(logger, 'mise', ['install'], {
    shell: true,
    cwd,
  });
  await execCommandInherit(logger, 'mise', ['exec', '--', 'swiftformat', ...paths], {
    shell: true,
    cwd,
  });
}
