import type { UnknownDesignToken } from '../unknown/unknown-design-token.ts';
import type { FontWeightDesignToken } from './font-weight-design-token.ts';

export function isFontWeightDesignToken(input: UnknownDesignToken): input is FontWeightDesignToken {
  return input.$type === 'fontWeight';
}
