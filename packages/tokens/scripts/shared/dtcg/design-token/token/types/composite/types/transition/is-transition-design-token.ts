import type { GenericDesignToken } from '../../../../generic-design-token.ts';
import type { TransitionDesignToken } from './transition-design-token.ts';

export function isTransitionDesignToken(input: GenericDesignToken): input is TransitionDesignToken {
  return input.$type === 'transition';
}
