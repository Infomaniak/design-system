import {
  buildSvgSetFromSvgDirectory,
  type BuildSvgSetFromSvgDirectoryOptions,
} from './build-svg-set-from-svg-directory.ts';
import {
  extractSvgFilesFromFigmaDesignFile,
  type ExtractSvgFilesFromFigmaDesignFileOptions,
} from './extract-svg-files-from-figma-design-file.ts';

export interface ExtractSvgFilesFromFigmaDesignFileAndBuildSetOptions
  extends
    Omit<ExtractSvgFilesFromFigmaDesignFileOptions, 'outputDirectory'>,
    Omit<BuildSvgSetFromSvgDirectoryOptions, 'sourceDirectory' | 'outputDirectory'> {
  readonly svgImagesOutputDirectory: string;
  readonly svgSetOutputDirectory: string;
}

export async function extractSvgFilesFromFigmaDesignFileAndBuildSet({
  svgImagesOutputDirectory,
  svgSetOutputDirectory,
  ...options
}: ExtractSvgFilesFromFigmaDesignFileAndBuildSetOptions): Promise<boolean> {
  await extractSvgFilesFromFigmaDesignFile({
    ...options,
    outputDirectory: svgImagesOutputDirectory,
  });

  return await buildSvgSetFromSvgDirectory({
    ...options,
    sourceDirectory: svgImagesOutputDirectory,
    outputDirectory: svgSetOutputDirectory,
  });
}
