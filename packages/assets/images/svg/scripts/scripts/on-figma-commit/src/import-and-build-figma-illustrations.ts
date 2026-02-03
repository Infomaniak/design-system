import { join } from 'node:path';
import { ASSETS_PATH } from '../../helpers/constants/assets-path.constant.ts';
import { type Logger } from '../../helpers/log/logger.ts';
import { importFigmaDesignAsSvgDirectoryAndSet } from '../../helpers/svg/import-figma-design-as-svg-directory-and-set.ts';
import { getEnvFigmaIllustrationFileKey } from '../../helpers/figma/env/get-env-figma-illustration-file-key.ts';

/*
 The figma "illustrations" design: TODO
*/

export function importAndBuildFigmaIllustrations(logger: Logger): Promise<void> {
  const fileKey: string = getEnvFigmaIllustrationFileKey();

  // TODO
  return importFigmaDesignAsSvgDirectoryAndSet({
    logger,
    fileKey,
    prefix: 'ik-illustration',
    svgImagesDestination: join(ASSETS_PATH, 'svg/illustrations/figma'),
    svgSetDestination: join(ASSETS_PATH, 'server'),
    monotone: false,
  });
}
