import { fontWeightStaticToFileName } from '../../../static/to/file-name/font-weight-static-to-file-name.ts';
import type { FontWeightRange } from '../../font-weight-range.ts';

export function fontWeightRangeToFileName([start, end]: FontWeightRange): string {
  return `${fontWeightStaticToFileName(start)}-${fontWeightStaticToFileName(end)}`;
}
