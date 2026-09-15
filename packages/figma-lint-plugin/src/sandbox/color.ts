import type { FigmaRgba } from './figma-types.ts';

/**
 * Formats a Figma RGBA color (0..1 float channels) as a display hex value.
 * Alpha is ignored for display purposes.
 */
export function figmaRgbaToHex({ r, g, b }: FigmaRgba): string {
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`.toUpperCase();
}

function toHexByte(channel: number): string {
  const clamped: number = Math.min(1, Math.max(0, channel));

  return Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0');
}
