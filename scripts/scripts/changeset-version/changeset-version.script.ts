import { join } from 'node:path';
import process from 'node:process';

import { Logger } from '../../helpers/log/logger.ts';
import type { RunScriptNotification } from '../../helpers/misc/run-script/notification/run-script-notification.ts';
import { runScript } from '../../helpers/misc/run-script/run-script.ts';
import { runChangesetVersion } from './src/changeset-version.ts';

await runScript(
  'changeset-version',
  async (logger: Logger): Promise<RunScriptNotification | void> => {
    await runChangesetVersion({
      changesetDirectory: join(process.cwd(), '.changeset'),
      logger,
    });
  },
);
