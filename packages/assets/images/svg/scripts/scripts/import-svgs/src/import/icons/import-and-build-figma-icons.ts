import { join } from 'node:path';
import {
  extractSvgFilesFromFigmaDesignFileAndBuildSet,
  type ExtractSvgFilesFromFigmaDesignFileAndBuildSetOptions,
} from '../../../../../shared/svg/figma/extract-svg-files-from-figma-design-file-and-build-set.ts';

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
}: ImportAndBuildFigmaIconsOptions): Promise<boolean> {
  return logger.asyncTask('icons', async (): Promise<boolean> => {
    return extractSvgFilesFromFigmaDesignFileAndBuildSet({
      ...options,
      logger,
      prefix: 'esds',
      svgImagesOutputDirectory: join(outputDirectory, FIGMA_ICONS_SUB_DIRECTORY_PATH),
      svgSetOutputDirectory: join(outputDirectory, 'server'),
      monotone: true,
    });
  });
}

export const FIGMA_ICONS_SUB_DIRECTORY_PATH = 'svg/monotone/figma';
