import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import {
  importAndBuildFigmaIcons,
  type ImportAndBuildFigmaIconsOptions,
} from './icons/import-and-build-figma-icons.ts';

export interface ImportIconsAndIllustrationsOptions extends ImportAndBuildFigmaIconsOptions {
  readonly logger: Logger;
}

export function importIconsAndIllustrations({
  logger,
  ...options
}: ImportIconsAndIllustrationsOptions): Promise<boolean> {
  return logger.asyncTask('import', async (): Promise<boolean> => {
    return [
      // NOTE: keep sequential await instead of Promise.allSettled for better logging
      await importAndBuildFigmaIcons({
        ...options,
        logger,
      }),
      // TODO: add support for illustrations
    ].some((changed: boolean): boolean => changed);
  });
}
