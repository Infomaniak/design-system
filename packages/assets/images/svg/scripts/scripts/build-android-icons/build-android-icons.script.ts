import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from '../../../../../../../scripts/helpers/log/logger.ts';
import { runScript } from '../../../../../../../scripts/helpers/misc/run-script/run-script.ts';
import { generateAndroidIcons } from '../../shared/android-icons/generate-android-icons.ts';

const SCRIPT_DIR: string = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT_DIR: string = join(SCRIPT_DIR, '../../..');
const FIGMA_ICONS_DIRECTORY: string = join(PACKAGE_ROOT_DIR, 'assets/svg/monotone/figma');
const OUTPUT_DIR: string = join(PACKAGE_ROOT_DIR, 'dist/android/icons');
const VALKYRIE_CLI_INSTALL_DIR: string = join(PACKAGE_ROOT_DIR, 'node_modules/.cache/valkyrie-cli');

await runScript('build-android-icons', async (logger: Logger): Promise<void> => {
  const iconNames: readonly string[] = await generateAndroidIcons({
    sourceDirectory: FIGMA_ICONS_DIRECTORY,
    outputDirectory: OUTPUT_DIR,
    valkyrieCliInstallDirectory: VALKYRIE_CLI_INSTALL_DIR,
    logger,
  });

  logger.info(
    `Generated ${String(iconNames.length)} Android icons in ${JSON.stringify(OUTPUT_DIR)}.`,
  );
});
