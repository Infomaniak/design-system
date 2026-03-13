import { join } from 'node:path';
import { ASSETS_PATH } from '../../helpers/constants/assets-path.constant.ts';
import { type Logger } from '../../helpers/log/logger.ts';
import { importAndOptimizeSvgDirectoryAsSvgSet } from '../../helpers/svg/import-and-optimize-svg-directory-as-svg-set.ts';

export function buildLegacyIcons(logger: Logger): Promise<void> {
  return importAndOptimizeSvgDirectoryAsSvgSet({
    logger,
    source: join(ASSETS_PATH, 'svg/monotone/legacy'),
    destination: join(ASSETS_PATH, 'server'),
    prefix: 'ik-legacy',
    monotone: true,
  });
}
