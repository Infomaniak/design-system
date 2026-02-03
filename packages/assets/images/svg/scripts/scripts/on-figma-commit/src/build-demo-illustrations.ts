import { join } from 'node:path';
import { ASSETS_PATH } from '../../helpers/constants/assets-path.constant.ts';
import { Logger } from '../../helpers/log/logger.ts';
import { importAndOptimizeSvgDirectoryAsSvgSet } from '../../helpers/svg/import-and-optimize-svg-directory-as-svg-set.ts';

/**
 * DEMO FUNCTION
 * @deprecated
 */
export function buildDemoIllustrations(): Promise<void> {
  // TODO
  return importAndOptimizeSvgDirectoryAsSvgSet({
    logger: Logger.NEVER,
    source: join(ASSETS_PATH, 'svg/illustrations/demo'),
    destination: join(ASSETS_PATH, 'server'),
    prefix: 'ik-illustrations-demo',
    monotone: false,
    optimize: false,
  });
}
