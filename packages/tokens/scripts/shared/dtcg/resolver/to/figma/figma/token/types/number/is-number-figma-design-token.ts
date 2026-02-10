import type { GenericDesignToken } from '../../../../../../../design-token/token/generic-design-token.ts';
import type { NumberFigmaDesignToken } from './number-figma-design-token.ts';

export function isNumberFigmaDesignToken(
  input: GenericDesignToken,
): input is NumberFigmaDesignToken {
  return input.$type === 'number';
}
