import type { UnknownDesignToken } from '../unknown/unknown-design-token.ts';
import type { DurationDesignToken } from './duration-design-token.ts';

export function isDurationDesignToken(input: UnknownDesignToken): input is DurationDesignToken {
  return input.$type === 'duration';
}
