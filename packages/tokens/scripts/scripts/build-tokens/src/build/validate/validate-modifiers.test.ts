import { describe, expect, it } from 'vitest';
import { DesignTokensCollection } from '../../../../../shared/dtcg/resolver/design-tokens-collection.ts';
import type { DesignTokenModifiers } from '../../../../../shared/dtcg/resolver/modifiers/design-token-modifiers.ts';
import type { ColorDesignTokensCollectionToken } from '../../../../../shared/dtcg/resolver/token/types/base/color/color-design-tokens-collection-token.ts';
import { validateModifiers } from './validate-modifiers.ts';

function createMockToken(
  name: string[],
  files: string[],
  value: string = `{${name.join('.')}}`,
): ColorDesignTokensCollectionToken {
  return {
    files,
    name,
    type: 'color',
    value,
  } as ColorDesignTokensCollectionToken;
}

describe('validateModifiers', () => {
  describe('valid cases', () => {
    it('should pass when modifiers contain tokens from t2-semantic directory', () => {
      const modifiers: DesignTokenModifiers = new Map([
        [
          'theme',
          new Map([
            [
              'light',
              new DesignTokensCollection([
                createMockToken(
                  ['color', 'background', 'brand', 'infomaniak', 'default'],
                  ['/tokens/t2-semantic/modifiers/theme/light/color.tokens.json'],
                ),
              ]),
            ],
          ]),
        ],
      ]);

      expect(() => validateModifiers(modifiers)).not.toThrow();
    });

    it('should pass when modifiers contain tokens from t3-component directory', () => {
      const modifiers: DesignTokenModifiers = new Map([
        [
          'theme',
          new Map([
            [
              'light',
              new DesignTokensCollection([
                createMockToken(
                  ['button', 'background', 'brand', 'default'],
                  ['/tokens/t3-component/modifiers/theme/light/button.tokens.json'],
                ),
              ]),
            ],
          ]),
        ],
      ]);

      expect(() => validateModifiers(modifiers)).not.toThrow();
    });

    it('should pass when modifier has multiple contexts (light/dark) with the same tokens', () => {
      const modifiers: DesignTokenModifiers = new Map([
        [
          'theme',
          new Map([
            [
              'light',
              new DesignTokensCollection([
                createMockToken(
                  ['color', 'background', 'main', 'default'],
                  ['/tokens/t2-semantic/modifiers/theme/light/color.tokens.json'],
                ),
                createMockToken(
                  ['color', 'text', 'brand', 'default'],
                  ['/tokens/t2-semantic/modifiers/theme/light/color.tokens.json'],
                ),
              ]),
            ],
            [
              'dark',
              new DesignTokensCollection([
                createMockToken(
                  ['color', 'background', 'main', 'default'],
                  ['/tokens/t2-semantic/modifiers/theme/dark/color.tokens.json'],
                ),
                createMockToken(
                  ['color', 'text', 'brand', 'default'],
                  ['/tokens/t2-semantic/modifiers/theme/dark/color.tokens.json'],
                ),
              ]),
            ],
          ]),
        ],
      ]);

      expect(() => validateModifiers(modifiers)).not.toThrow();
    });

    it('should pass with product modifier similar to infomaniak.tokens.json', () => {
      const modifiers: DesignTokenModifiers = new Map([
        [
          'product',
          new Map([
            [
              'infomaniak',
              new DesignTokensCollection([
                createMockToken(
                  ['color', 'background', 'brand', 'default'],
                  ['/tokens/t2-semantic/modifiers/product/infomaniak/color.tokens.json'],
                ),
                createMockToken(
                  ['color', 'background', 'brand', 'hover'],
                  ['/tokens/t2-semantic/modifiers/product/infomaniak/color.tokens.json'],
                ),
                createMockToken(
                  ['color', 'background', 'brand', 'pressed'],
                  ['/tokens/t2-semantic/modifiers/product/infomaniak/color.tokens.json'],
                ),
              ]),
            ],
          ]),
        ],
      ]);

      expect(() => validateModifiers(modifiers)).not.toThrow();
    });

    it('should pass with multiple different modifiers (theme and product)', () => {
      const modifiers: DesignTokenModifiers = new Map([
        [
          'theme',
          new Map([
            [
              'light',
              new DesignTokensCollection([
                createMockToken(
                  ['color', 'background', 'main'],
                  ['/tokens/t2-semantic/modifiers/theme/light/color.tokens.json'],
                ),
              ]),
            ],
          ]),
        ],
        [
          'product',
          new Map([
            [
              'infomaniak',
              new DesignTokensCollection([
                createMockToken(
                  ['color', 'brand', 'primary'],
                  ['/tokens/t2-semantic/modifiers/product/infomaniak/color.tokens.json'],
                ),
              ]),
            ],
          ]),
        ],
      ]);

      expect(() => validateModifiers(modifiers)).not.toThrow();
    });

    it('should pass when modifiers are empty', () => {
      const modifiers: DesignTokenModifiers = new Map();

      expect(() => validateModifiers(modifiers)).not.toThrow();
    });

    it('should pass when a modifier has empty contexts', () => {
      const modifiers: DesignTokenModifiers = new Map([
        ['theme', new Map([['light', new DesignTokensCollection([])]])],
      ]);

      expect(() => validateModifiers(modifiers)).not.toThrow();
    });
  });

  describe('error cases', () => {
    describe('tokens not in t1-primitive, t2-semantic, or t3-component', () => {
      it('should throw when token is not from valid token directories', () => {
        const modifiers: DesignTokenModifiers = new Map([
          [
            'theme',
            new Map([
              [
                'light',
                new DesignTokensCollection([
                  createMockToken(
                    ['color', 'background', 'main'],
                    ['/some/other/path/modifiers/theme/light/color.tokens.json'],
                  ),
                ]),
              ],
            ]),
          ],
        ]);

        expect(() => validateModifiers(modifiers)).toThrow();
      });
    });

    describe('inconsistent contexts', () => {
      it('should throw when first context has more tokens than second context', () => {
        const modifiers: DesignTokenModifiers = new Map([
          [
            'theme',
            new Map([
              [
                'light',
                new DesignTokensCollection([
                  createMockToken(
                    ['color', 'background', 'main'],
                    ['/tokens/t2-semantic/modifiers/theme/light/color.tokens.json'],
                  ),
                  createMockToken(
                    ['color', 'background', 'secondary'],
                    ['/tokens/t2-semantic/modifiers/theme/light/color.tokens.json'],
                  ),
                ]),
              ],
              [
                'dark',
                new DesignTokensCollection([
                  createMockToken(
                    ['color', 'background', 'main'],
                    ['/tokens/t2-semantic/modifiers/theme/dark/color.tokens.json'],
                  ),
                  // missing color.background.secondary
                ]),
              ],
            ]),
          ],
        ]);

        expect(() => validateModifiers(modifiers)).toThrow();
      });

      it('should throw when contexts have different tokens', () => {
        const modifiers: DesignTokenModifiers = new Map([
          [
            'theme',
            new Map([
              [
                'light',
                new DesignTokensCollection([
                  createMockToken(
                    ['color', 'background', 'main'],
                    ['/tokens/t2-semantic/modifiers/theme/light/color.tokens.json'],
                  ),
                ]),
              ],
              [
                'dark',
                new DesignTokensCollection([
                  createMockToken(
                    ['color', 'background', 'overlay'],
                    ['/tokens/t2-semantic/modifiers/theme/dark/color.tokens.json'],
                  ),
                ]),
              ],
            ]),
          ],
        ]);

        expect(() => validateModifiers(modifiers)).toThrow();
      });
    });

    describe('duplicate token usage across modifiers', () => {
      it('should throw when the same token is modified by multiple modifiers', () => {
        const modifiers: DesignTokenModifiers = new Map([
          [
            'theme',
            new Map([
              [
                'light',
                new DesignTokensCollection([
                  createMockToken(
                    ['color', 'background', 'brand', 'default'],
                    ['/tokens/t2-semantic/modifiers/theme/light/color.tokens.json'],
                  ),
                ]),
              ],
            ]),
          ],
          [
            'product',
            new Map([
              [
                'infomaniak',
                new DesignTokensCollection([
                  createMockToken(
                    ['color', 'background', 'brand', 'default'],
                    ['/tokens/t2-semantic/modifiers/product/infomaniak/color.tokens.json'],
                  ),
                ]),
              ],
            ]),
          ],
        ]);

        expect(() => validateModifiers(modifiers)).toThrow();
      });

      it('should throw when three modifiers try to modify overlapping tokens', () => {
        const modifiers: DesignTokenModifiers = new Map([
          [
            'theme',
            new Map([
              [
                'light',
                new DesignTokensCollection([
                  createMockToken(
                    ['a'],
                    ['/tokens/t2-semantic/modifiers/theme/light/a.tokens.json'],
                  ),
                ]),
              ],
            ]),
          ],
          [
            'product',
            new Map([
              [
                'infomaniak',
                new DesignTokensCollection([
                  createMockToken(
                    ['a'],
                    ['/tokens/t2-semantic/modifiers/product/infomaniak/a.tokens.json'],
                  ),
                  createMockToken(
                    ['b'],
                    ['/tokens/t2-semantic/modifiers/product/infomaniak/b.tokens.json'],
                  ),
                ]),
              ],
            ]),
          ],
          [
            'size',
            new Map([
              [
                'compact',
                new DesignTokensCollection([
                  createMockToken(
                    ['b'],
                    ['/tokens/t1-primitive/modifiers/size/compact/b.tokens.json'],
                  ),
                ]),
              ],
            ]),
          ],
        ]);

        expect(() => validateModifiers(modifiers)).toThrow();
      });
    });
  });
});
