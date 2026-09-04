import { describe, expect, test } from 'vitest';
import {
  IOS_SYMBOLS_DESTINATION_PATH,
  SYMBOL_FILL_RATIO,
  SYMBOL_NAME_PREFIX,
  SYMBOLS_XCASSETS_DIRECTORY_NAME,
} from './sf-symbols-config.ts';

describe('sf-symbols-config', () => {
  test('exposes the expected defaults', () => {
    expect(SYMBOL_NAME_PREFIX).toBe('esds-');
    expect(SYMBOLS_XCASSETS_DIRECTORY_NAME).toBe('ESDSSymbols.xcassets');
    expect(SYMBOL_FILL_RATIO).toBe(1);
    expect(IOS_SYMBOLS_DESTINATION_PATH).toBe('Sources/ESDSSymbols/Symbols.xcassets');
  });
});
