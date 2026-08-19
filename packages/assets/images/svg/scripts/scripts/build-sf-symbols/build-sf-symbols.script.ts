import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { convertSvgToSymbolset } from '../../shared/svg/sf-symbols/convert-svg-to-symbolset.ts';

const ROOT_DIR: string = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const FIGMA_ICONS_DIR: string = join(ROOT_DIR, 'assets/svg/monotone/figma');
const OUTPUT_DIR: string = join(ROOT_DIR, 'dist/ios/sf-symbols');
const PREFIX: string = 'esds';

await runScript('build-sf-symbols', async (logger: Logger): Promise<void> => {
  await rm(OUTPUT_DIR, { force: true, recursive: true });

  await convertSvgToSymbolset({
    inputDirectory: FIGMA_ICONS_DIR,
    outputDirectory: OUTPUT_DIR,
    prefix: PREFIX,
    logger,
  });
});
