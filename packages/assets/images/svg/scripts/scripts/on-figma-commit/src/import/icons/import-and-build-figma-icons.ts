import { join } from 'node:path';
import {
  extractSvgFilesFromFigmaDesignFileAndBuildSet,
  type ExtractSvgFilesFromFigmaDesignFileAndBuildSetOptions,
} from '../../../../../shared/svg/figma/extract-svg-files-from-figma-design-file-and-build-set.ts';

/*
  The figma "icons" design: https://www.figma.com/design/15F6clEEytVf34fPCGoRfs/IKDS---Icons?node-id=0-1&p=f&t=XZLqlGGsohWqWGrH-0
*/

export interface ImportAndBuildFigmaIconsOptions extends Omit<
  ExtractSvgFilesFromFigmaDesignFileAndBuildSetOptions,
  'prefix' | 'svgImagesOutputDirectory' | 'svgSetOutputDirectory' | 'hasStockedVersion' | 'monotone'
> {
  readonly outputDirectory: string;
}

export function importAndBuildFigmaIcons({
  outputDirectory,
  logger,
  ...options
}: ImportAndBuildFigmaIconsOptions): Promise<void> {
  return logger.asyncTask('icons', async (): Promise<void> => {
    return extractSvgFilesFromFigmaDesignFileAndBuildSet({
      ...options,
      logger,
      prefix: 'esds',
      svgImagesOutputDirectory: join(outputDirectory, 'svg/monotone/figma'),
      svgSetOutputDirectory: join(outputDirectory, 'server'),
      hasStockedVersion: true,
      monotone: true,
    });
  });
}
