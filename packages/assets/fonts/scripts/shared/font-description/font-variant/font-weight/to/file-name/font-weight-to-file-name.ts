import type { FontWeight } from '../../font-weight.ts';
import { fontWeightRangeToFileName } from '../../range/to/file-name/font-weight-range-to-file-name.ts';
import { fontWeightStaticToFileName } from '../../static/to/file-name/font-weight-static-to-file-name.ts';

export function fontWeightToFileName(input: FontWeight): string {
  return `weight[${
    typeof input === 'number' ? fontWeightStaticToFileName(input) : fontWeightRangeToFileName(input)
  }]`;
}
