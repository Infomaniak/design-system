import type { UnknownDesignToken } from '../../unknown/unknown-design-token.ts';
import type { ShadowDesignToken } from './shadow-design-token.ts';

export function isShadowDesignToken(input: UnknownDesignToken): input is ShadowDesignToken {
  return input.$type === 'shadow';
}
