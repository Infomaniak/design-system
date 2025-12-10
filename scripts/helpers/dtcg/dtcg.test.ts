import { describe, test } from 'vitest';
import { dimensionDesignTokenToCssVarDeclaration } from './types/token/types/dimension/to/css-var-declaration/dimension-design-token-to-css-var-declaration.ts';
import type { DesignTokensTree } from './types/tree/design-tokens-tree.ts';

describe('dtcg', () => {
  // test('debug', () => {});
  test('dimension', () => {
    const tree: DesignTokensTree = {
      'spacing-stack-0': {
        $value: {
          value: 0,
          unit: 'px',
        },
        $type: 'dimension',
      },
      'spacing-stack-1': {
        $value: {
          value: 0.5,
          unit: 'rem',
        },
        $deprecated: 'use spacing-stack-0 instead',
        $type: 'dimension',
      },
    };

    console.log(dimensionDesignTokenToCssVarDeclaration(tree['spacing-stack-1'] as any, '--a-b'));
  });
});
