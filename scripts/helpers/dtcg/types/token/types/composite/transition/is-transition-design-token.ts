import type { UnknownDesignToken } from '../../unknown/unknown-design-token.ts';
import type { TransitionDesignToken } from './transition-design-token.ts';

export function isTransitionDesignToken(input: UnknownDesignToken): input is TransitionDesignToken {
  return input.$type === 'transition';
}
