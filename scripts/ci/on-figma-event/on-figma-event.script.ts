import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadOptionallyEnvFile } from '../../helpers/env/env-file/load-optionally-env-file.ts';
import { getEnvFigmaEvent } from '../../helpers/figma/env/get-env-figma-event.ts';
import { DEFAULT_LOG_LEVEL } from '../../helpers/log/log-level/defaults/default-log-level.ts';
import { Logger } from '../../helpers/log/logger.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const logger = Logger.root({ logLevel: DEFAULT_LOG_LEVEL });

export async function onFigmaEventScript(): Promise<void> {
  return logger.asyncTask('on-figma-event.script', async (logger: Logger): Promise<void> => {
    loadOptionallyEnvFile(logger);

    logger.info('Figma event received.');

    console.log(getEnvFigmaEvent());
  });
}

try {
  await onFigmaEventScript();
} catch (error: unknown) {
  logger.fatal(error);
}
