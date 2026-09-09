import type { FontOpticalSizing } from '../../font-optical-sizing.ts';

export function fontOpticalSizingToFileName(input: FontOpticalSizing | undefined): string {
  return `opsz[${input ?? 'none'}]`;
}
