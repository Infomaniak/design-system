/**
 * Formats RGB channels (0..1 float range, as Figma represents colors) as a
 * display hex value. Alpha is ignored for display purposes.
 *
 * Lives in core because both the sandbox extraction (paint hex labels) and the
 * fix-mode suggestion engine (matching variable values to observed hexes) need
 * the exact same formatting.
 */
export interface RgbChannels {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export function rgbaToHex({ r, g, b }: RgbChannels): string {
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`.toUpperCase();
}

function toHexByte(channel: number): string {
  const clamped: number = Math.min(1, Math.max(0, channel));

  return Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0');
}
