import ttf2woff2 from '@0x6b/ttf2woff2-wasm';
import { readFile } from 'node:fs/promises';
import { toAbsolutePath } from '../../../../../../../../../scripts/helpers/path/to-absolute-path.ts';

import type { FontVariant } from '../../font-variant.ts';

export interface FontVariantToWoff2Options {
  readonly cwd?: string;
}

export async function fontVariantToWoff2(
  { src }: Pick<FontVariant, 'src'>,
  { cwd }: FontVariantToWoff2Options = {},
): Promise<Uint8Array> {
  if (!src.endsWith('.ttf')) {
    throw new Error(`Unsupported font variant source: ${src}`);
  }
  return ttf2woff2(await readFile(toAbsolutePath(src, cwd)));
}
