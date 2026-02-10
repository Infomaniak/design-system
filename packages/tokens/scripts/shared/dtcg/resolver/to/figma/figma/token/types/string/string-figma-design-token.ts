import type { FigmaDesignToken } from '../../figma-design-token.ts';
import type { StringFigmaDesignTokenValue } from './value/string-figma-design-token-value.ts';

export type StringFigmaDesignToken = FigmaDesignToken<'string', StringFigmaDesignTokenValue>;
