/**
 * @inheritDoc https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-weight
 */
export type FontFaceFontWeight =
  'auto' | FontFaceFontWeightAbsolute | FontFaceFontWeightAbsoluteRange;

export type FontFaceFontWeightAbsolute = 'normal' | 'bold' | number;

export type FontFaceFontWeightAbsoluteRange = readonly [
  FontFaceFontWeightAbsolute,
  FontFaceFontWeightAbsolute,
];
