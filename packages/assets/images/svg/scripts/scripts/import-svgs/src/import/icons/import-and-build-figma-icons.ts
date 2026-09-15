import { join } from 'node:path';
import {
  extractSvgFilesFromFigmaDesignFileAndBuildSet,
  type ExtractSvgFilesFromFigmaDesignFileAndBuildSetOptions,
} from '../../../../../shared/svg/figma/extract-svg-files-from-figma-design-file-and-build-set.ts';
import { FIGMA_SVG_OUTLINES_SUB_DIRECTORY_NAME } from '../../../../../shared/svg/figma/extract-svg-files-from-figma-design-file.ts';

export interface ImportAndBuildFigmaIconsOptions extends Omit<
  ExtractSvgFilesFromFigmaDesignFileAndBuildSetOptions,
  | 'prefix'
  | 'svgImagesOutputDirectory'
  | 'svgSetOutputDirectory'
  | 'hasStockedVersion'
  | 'generateMasks'
  | 'generateOutlinedSvgs'
  | 'excludeSubDirectories'
  | 'monotone'
  | 'withOpticalSizes'
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
      generateMasks: true,
      generateOutlinedSvgs: true,
      excludeSubDirectories: [FIGMA_SVG_OUTLINES_SUB_DIRECTORY_NAME],
      monotone: true,
      withOpticalSizes: true,
    });
  });
}

export const FIGMA_ICONS_SUB_DIRECTORY_PATH = 'svg/monotone/figma';
