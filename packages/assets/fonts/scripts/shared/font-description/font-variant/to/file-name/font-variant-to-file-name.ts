import { fontOpticalSizingToFileName } from '../../font-optical-sizing/to/file-name/font-optical-sizing-to-file-name.ts';
import { fontStyleToFileName } from '../../font-style/to/file-name/font-style-to-file-name.ts';
import type { FontVariant } from '../../font-variant.ts';
import { fontWeightToFileName } from '../../font-weight/to/file-name/font-weight-to-file-name.ts';

export function fontVariantToFileName({
  style,
  weight,
  opticalSizing,
}: Omit<FontVariant, 'src'>): string {
  return `${fontStyleToFileName(style)}.${fontWeightToFileName(weight)}.${fontOpticalSizingToFileName(opticalSizing)}`;
}
