import type { GenericDesignToken } from '../../../../../../../design-token/token/generic-design-token.ts';
import type { ColorFigmaDesignToken } from './color-figma-design-token.ts';

export function isColorFigmaDesignToken(input: GenericDesignToken): input is ColorFigmaDesignToken {
  return input.$type === 'color';
}
