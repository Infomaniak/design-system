import type { GenericDesignToken } from '../../../../generic-design-token.ts';
import type { ShadowDesignToken } from './shadow-design-token.ts';

export function isShadowDesignToken(input: GenericDesignToken): input is ShadowDesignToken {
  return input.$type === 'shadow';
}
