import type { FigmaDesignToken } from '../../figma-design-token.ts';
import type { ColorFigmaDesignTokenValue } from './value/color-figma-design-token-value.ts';

export type ColorFigmaDesignToken = FigmaDesignToken<'color', ColorFigmaDesignTokenValue>;
