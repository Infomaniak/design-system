import { join } from 'node:path';
import type { Logger } from '../../../../../../../../scripts/helpers/log/logger.ts';
import { removeTrailingSlash } from '../../../../../../../../scripts/helpers/path/remove-traling-slash.ts';

/*
  The figma "icons" design: https://www.figma.com/design/15F6clEEytVf34fPCGoRfs/IKDS---Icons?node-id=0-1&p=f&t=XZLqlGGsohWqWGrH-0
*/

export interface ImportAndBuildFigmaIconsOptions {
  readonly figmaSourceFileKey: string;
  readonly outputDirectory: string;
  readonly logger: Logger;
}

export function importAndBuildFigmaIcons({
  figmaSourceFileKey,
  outputDirectory,
  logger,
}: ImportAndBuildFigmaIconsOptions): Promise<void> {
  return logger.asyncTask('icons', async (): Promise<void> => {
    outputDirectory = removeTrailingSlash(outputDirectory);
    // const fileKey: string = getEnvFigmaIconFileKey();

    return importFigmaDesignAsSvgDirectoryAndSet({
      logger,
      fileKey: figmaSourceFileKey,
      prefix: 'ik',
      svgImagesDestination: join(outputDirectory, 'svg/monotone/figma'),
      svgSetDestination: join(outputDirectory, 'server'),
      hasStockedVersion: true,
      monotone: true,
    });
  });
}
