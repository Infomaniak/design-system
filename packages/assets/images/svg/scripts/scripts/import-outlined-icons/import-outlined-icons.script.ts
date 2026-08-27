import { mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getEnvFigmaApiToken } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-api-token.ts';
import { getEnvFigmaIconOutlineFileKey } from '../../../../../../../scripts/helpers/figma/env/get-env-figma-icon-outline-file-key.ts';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { extractOutlinedSvgFilesFromFigmaDesignFile } from '../../shared/svg/figma/extract-outlined-svg-files-from-figma-design-file.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const OUTLINED_ICONS_OUTPUT_DIR: string = join(ROOT_DIR, 'dist/assets/svg/outlined/figma');

await runScript('import-outlined-icons', async (logger: Logger): Promise<void> => {
  await rm(OUTLINED_ICONS_OUTPUT_DIR, { force: true, recursive: true });
  await mkdir(OUTLINED_ICONS_OUTPUT_DIR, { recursive: true });

  const figmaApiToken: string = getEnvFigmaApiToken();
  const figmaOutlineFileKey: string = getEnvFigmaIconOutlineFileKey();

  await extractOutlinedSvgFilesFromFigmaDesignFile({
    figmaAPIToken: figmaApiToken,
    figmaSourceFileKey: figmaOutlineFileKey,
    outputDirectory: OUTLINED_ICONS_OUTPUT_DIR,
    logger,
  });

  logger.info(`Outlined icons fetched to ${OUTLINED_ICONS_OUTPUT_DIR}`);
});
