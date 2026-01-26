import type { GenericDesignToken } from '../../../../generic-design-token.ts';
import type { FontWeightDesignToken } from './font-weight-design-token.ts';

export function isFontWeightDesignToken(input: GenericDesignToken): input is FontWeightDesignToken {
  return input.$type === 'fontWeight';
}
