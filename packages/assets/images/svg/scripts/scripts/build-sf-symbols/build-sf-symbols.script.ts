import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { generateSfSymbols } from '../../shared/sf-symbols/generate-sf-symbols.ts';
import { SYMBOLS_XCASSETS_DIRECTORY_NAME } from '../../shared/sf-symbols/sf-symbols-config.ts';

const SCRIPT_DIR: string = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT_DIR: string = join(SCRIPT_DIR, '../../..');
const FIGMA_ICONS_DIRECTORY: string = join(PACKAGE_ROOT_DIR, 'assets/svg/monotone/figma');
const FIGMA_ICONS_OUTLINES_DIRECTORY: string = join(FIGMA_ICONS_DIRECTORY, 'outlines');
const OUTPUT_DIR: string = join(PACKAGE_ROOT_DIR, 'dist/sf-symbols');

await runScript('build-sf-symbols', async (logger: Logger): Promise<void> => {
  const icons = await generateSfSymbols({
    outputDirectory: OUTPUT_DIR,
    outlinesDirectory: FIGMA_ICONS_OUTLINES_DIRECTORY,
    webIconsDirectory: FIGMA_ICONS_DIRECTORY,
    logger,
  });

  logger.info(
    `Generated ${String(icons.length)} SF Symbols in ${JSON.stringify(join(OUTPUT_DIR, SYMBOLS_XCASSETS_DIRECTORY_NAME))}.`,
  );
});
