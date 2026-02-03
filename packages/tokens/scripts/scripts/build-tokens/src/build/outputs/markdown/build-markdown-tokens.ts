import type Color from 'colorjs.io';
import { writeFileSafe } from '../../../../../../../../../scripts/helpers/file/write-file-safe.ts';
import type { Logger } from '../../../../../../../../../scripts/helpers/log/logger.ts';
import { colorDesignTokenValueToColorJs } from '../../../../../../shared/dtcg/design-token/token/types/base/types/color/value/to/colorjs/color-design-token-value-to-color-js.ts';
import { DesignTokensCollection } from '../../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { GenericDesignTokensCollectionTokenWithType } from '../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts';
import { isColorDesignTokensCollectionToken } from '../../../../../../shared/dtcg/resolver/token/types/base/color/is-color-design-tokens-collection-token.ts';

