import type { UnknownDesignToken } from '../../unknown/unknown-design-token.ts';
import type { GradientDesignToken } from './gradient-design-token.ts';

export function isGradientDesignToken(input: UnknownDesignToken): input is GradientDesignToken {
  return input.$type === 'gradient';
}
