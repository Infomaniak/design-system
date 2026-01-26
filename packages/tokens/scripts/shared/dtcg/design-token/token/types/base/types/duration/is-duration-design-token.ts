import type { GenericDesignToken } from '../../../../generic-design-token.ts';
import type { DurationDesignToken } from './duration-design-token.ts';

export function isDurationDesignToken(input: GenericDesignToken): input is DurationDesignToken {
  return input.$type === 'duration';
}
