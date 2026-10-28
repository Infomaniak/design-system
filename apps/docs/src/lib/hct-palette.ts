import { Hct, hexFromArgb, TonalPalette } from '@material/material-color-utilities';

export const DEFAULT_TONES: readonly number[] = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 95, 98, 99, 100,
];

export interface PaletteEntry {
  readonly tone: number;
  readonly hex: string;
}

/**
 * Normalizes a user-provided color to an uppercase `#RRGGBB` string.
 * @throws {Error} when the value is not a 6-digit hex color
 */
export function normalizeHex(value: string): string {
  const hex: string = value.trim().replace(/^#+/, '');
  if (!/^[0-9a-f]{6}$/i.test(hex)) {
    throw new Error('Use a 6-digit hex color, e.g. #888888');
  }
  return `#${hex.toUpperCase()}`;
}

export function isDark(hex: string): boolean {
  const value: number = Number.parseInt(normalizeHex(hex).slice(1), 16);
  const r: number = (value >> 16) & 0xff;
  const g: number = (value >> 8) & 0xff;
  const b: number = value & 0xff;
  return 0.299 * r + 0.587 * g + 0.114 * b < 128;
}

/**
 * Parses a comma separated list of tones (integers between 0 and 100).
 * @throws {Error} when a tone is invalid or the list is empty
 */
export function parseTones(value: string): number[] {
  const tones: number[] = value
    .split(',')
    .map((part: string): string => part.trim())
    .filter((part: string): boolean => part !== '')
    .map((part: string): number => {
      if (!/^-?\d+$/.test(part)) {
        throw new Error(`Invalid tone "${part}"`);
      }
      const tone: number = Number(part);
      if (tone < 0 || tone > 100) {
        throw new Error('Tones must be between 0 and 100');
      }
      return tone;
    });

  if (tones.length === 0) {
    throw new Error('Add at least one tone');
  }
  return tones;
}

/**
 * Generates the HCT tonal palette (Material Color Utilities) of a source color:
 * the hue and chroma of the source are kept, only the tone varies.
 */
export function generateTonalPalette(sourceHex: string, tones: readonly number[]): PaletteEntry[] {
  const argb: number = Number.parseInt(`ff${normalizeHex(sourceHex).slice(1)}`, 16) >>> 0;
  const hct: Hct = Hct.fromInt(argb);
  const palette: TonalPalette = TonalPalette.fromHueAndChroma(hct.hue, hct.chroma);

  return tones.map((tone: number): PaletteEntry => ({
    tone,
    hex: hexFromArgb(palette.tone(tone)).toUpperCase(),
  }));
}

export function formatPalette(entries: readonly PaletteEntry[]): string {
  return entries
    .map(({ tone, hex }: PaletteEntry): string => `${String(tone).padStart(3)}  ${hex}`)
    .join('\n');
}
