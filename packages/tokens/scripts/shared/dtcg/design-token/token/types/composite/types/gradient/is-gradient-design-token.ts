import type { GenericDesignToken } from '../../../../generic-design-token.ts';
import type { GradientDesignToken } from './gradient-design-token.ts';

export function isGradientDesignToken(input: GenericDesignToken): input is GradientDesignToken {
  return input.$type === 'gradient';
}
