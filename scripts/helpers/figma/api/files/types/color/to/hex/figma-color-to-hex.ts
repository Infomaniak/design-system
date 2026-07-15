import type { FigmaColor } from '../../figma-color.ts';

export function figmaColorToHex({ r, g, b, a }: FigmaColor): string {
  const toHex = (value: number): string => {
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${a === 1 ? '' : toHex(a)}`;
}
