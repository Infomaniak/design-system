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
}: ImportIconsAndIllustrationsOptions): Promise<void> {
  return logger.asyncTask('import', async (): Promise<void> => {
    await importAndBuildFigmaIcons({
      ...options,
      logger,
    });

    // const result: readonly PromiseSettledResult<void>[] = await Promise.allSettled([
    //   importAndBuildFigmaIcons(logger.child('FIGMA ICONS')),
    //   // importAndBuildFigmaIllustrations(),
    //   // buildLegacyIcons(),
    //   // buildDemoIllustrations(),
    // ]);
    //
    // const rejected: readonly PromiseRejectedResult[] = result.filter(
    //   (result: PromiseSettledResult<void>): result is PromiseRejectedResult =>
    //     result.status === 'rejected',
    // );
    //
    // if (rejected.length > 0) {
    //   throw new AggregateError(rejected.map((rejected) => rejected.reason));
    // }
  });
}
