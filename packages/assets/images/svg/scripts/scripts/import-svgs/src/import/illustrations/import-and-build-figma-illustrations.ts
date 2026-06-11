import { join } from 'node:path';
import {
  extractSvgFilesFromFigmaDesignFileAndBuildSet,
  type ExtractSvgFilesFromFigmaDesignFileAndBuildSetOptions,
} from '../../../../../shared/svg/figma/extract-svg-files-from-figma-design-file-and-build-set.ts';

export interface ImportAndBuildFigmaIllustrationsOptions extends Omit<
  ExtractSvgFilesFromFigmaDesignFileAndBuildSetOptions,
  | 'prefix'
  | 'svgImagesOutputDirectory'
  | 'svgSetOutputDirectory'
  | 'hasStockedVersion'
  | 'generateMasks'
  | 'monotone'
  | 'withOpticalSizes'
> {
  readonly outputDirectory: string;
}

export function importAndBuildFigmaIllustrations({
  outputDirectory,
  logger,
  ...options
}: ImportAndBuildFigmaIllustrationsOptions): Promise<boolean> {
  return logger.asyncTask('illustration', async (): Promise<boolean> => {
    return extractSvgFilesFromFigmaDesignFileAndBuildSet({
      ...options,
      logger,
      prefix: 'ik-illustration',
      svgImagesOutputDirectory: join(outputDirectory, 'svg/illustrations/figma'),
      svgSetOutputDirectory: join(outputDirectory, 'server'),
      generateMasks: false,
      monotone: false,
      withOpticalSizes: false,
    });
  });
}
