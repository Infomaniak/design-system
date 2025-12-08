import { DEFAULT_LOG_LEVEL_BRIGHT } from '../../../../scripts/helpers/log/log-level/defaults/default-log-level-bright.ts';
import { Logger } from '../../../../scripts/helpers/log/logger.ts';
import { noLog } from '../../../../scripts/helpers/log/raw/no-log.ts';
import { execCommandInherit } from '../../../../scripts/helpers/misc/exec-command.ts';

const logger = new Logger('MAIN', {
  logLevel: [...DEFAULT_LOG_LEVEL_BRIGHT, ['debug', noLog]],
});

export async function build(): Promise<void> {
  await execCommandInherit(logger, 'echo', ['build']);
}

build();
