import { describe, expect, test } from 'vitest';
import {
  IOS_SYMBOLS_DESTINATION_PATH,
  IOS_SYMBOLS_SWIFT_DESTINATION_PATH,
  SYMBOL_FILL_RATIO,
  SYMBOL_OUTLINE_VIEW_BOX_SIZE,
  SYMBOLS_SWIFT_FILE_NAME,
  SYMBOLS_XCASSETS_DIRECTORY_NAME,
} from './sf-symbols-config.ts';

describe('sf-symbols-config', () => {
  test('exposes the expected defaults', () => {
    expect(SYMBOLS_XCASSETS_DIRECTORY_NAME).toBe('ESDSSymbols.xcassets');
    expect(SYMBOLS_SWIFT_FILE_NAME).toBe('ESDSSymbols.swift');
    expect(SYMBOL_OUTLINE_VIEW_BOX_SIZE).toBe(24);
    expect(SYMBOL_FILL_RATIO).toBe(1);
    expect(IOS_SYMBOLS_DESTINATION_PATH).toBe('Sources/ESDSSymbols/Symbols.xcassets');
    expect(IOS_SYMBOLS_SWIFT_DESTINATION_PATH).toBe('Sources/ESDSSymbols/ESDSSymbols.swift');
  });
});
