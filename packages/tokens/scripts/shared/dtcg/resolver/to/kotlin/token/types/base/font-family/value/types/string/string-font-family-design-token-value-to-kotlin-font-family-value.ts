import type { StringFontFamilyDesignTokenValue } from '../../../../../../../../../../design-token/token/types/base/types/font-family/value/types/string/string-font-family-design-token-value.ts';

export function stringFontFamilyDesignTokenValueToKotlinFontFamilyValue(
  value: StringFontFamilyDesignTokenValue,
): string {
  switch (value) {
    case 'sans-serif':
      return 'FontFamily.SansSerif';
    case 'serif':
      return 'FontFamily.Serif';
    case 'monospace':
      return 'FontFamily.Monospace';
    case 'cursive':
      return 'FontFamily.Cursive';
    default:
      return 'FontFamily.Default';
    // TODO: in future we may import our own font like this:
    // import com.infomaniak.mail.R
    // return `FontFamily(Font(R.font.${value.replaceAll(/\W/g, '_')}))`;
  }
}
