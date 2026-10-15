import { describe, expect, it } from 'vitest';
import { buildIconNameList } from './icon-names.ts';

describe('buildIconNameList', () => {
  it('strips the .svg extension and sorts the names', () => {
    expect(buildIconNameList(['chevron-right.svg', 'plus.svg', 'arrow-left.svg'])).toEqual([
      'arrow-left',
      'chevron-right',
      'plus',
    ]);
  });

  it('deduplicates and ignores non-svg entries', () => {
    expect(
      buildIconNameList(['plus.svg', 'plus.svg', 'plus.metadata.json', 'chevron-down.svg']),
    ).toEqual(['chevron-down', 'plus']);
  });

  it('returns an empty list for no svg files', () => {
    expect(buildIconNameList([])).toEqual([]);
    expect(buildIconNameList(['readme.md'])).toEqual([]);
  });
});
