import StyleDictionary from 'style-dictionary';
import type { TransformedToken } from 'style-dictionary/types';

export function registerStyleDictionaryThemeFilter(): void {
  StyleDictionary.registerFilter({
    name: 'theme-filter',
    filter: (token: TransformedToken): boolean => {
      return token.filePath.includes('themes');
    },
  });
}
