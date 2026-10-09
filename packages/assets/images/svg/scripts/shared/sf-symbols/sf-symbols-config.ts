export const SYMBOLS_ENUM_NAME = 'ESDSSymbols';
export const SYMBOL_TYPE_NAME = 'Symbol';

export const SYMBOLS_XCASSETS_DIRECTORY_NAME = `${SYMBOLS_ENUM_NAME}.xcassets`;
export const SYMBOLS_SWIFT_FILE_NAME = `${SYMBOLS_ENUM_NAME}.swift`;

/*
  Outline SVGs are enforced to a square viewBox ("0 0 24 24"). Fitting maps this canvas onto the
  symbol cell, preserving the padding designed inside the canvas.
 */
export const SYMBOL_OUTLINE_VIEW_BOX_SIZE = 24;

export const SYMBOL_FILL_RATIO = 1;

export const IOS_SYMBOLS_DESTINATION_PATH = `Sources/${SYMBOLS_ENUM_NAME}/Symbols.xcassets`;
export const IOS_SYMBOLS_SWIFT_DESTINATION_PATH = `Sources/${SYMBOLS_ENUM_NAME}/${SYMBOLS_SWIFT_FILE_NAME}`;
