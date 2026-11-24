import type { CssVariableDeclaration } from '../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import {
  partitionCssVariableDeclarations,
  type PartitionedCssVariableDeclarations,
} from '../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/references-css-variable.ts';
import { cssVariableDeclarationsToTwoBlockString } from './css-variable-declarations-to-two-block-string.ts';

export interface BaseTokensCssFiles {
  readonly 'tokens.root.css': string;
  readonly 'tokens.attr.css': string;
}

export function buildBaseTokensCssFiles(
  declarations: readonly CssVariableDeclaration[],
): BaseTokensCssFiles {
  const { leaves, aliases }: PartitionedCssVariableDeclarations =
    partitionCssVariableDeclarations(declarations);

  return {
    'tokens.root.css': cssVariableDeclarationsToTwoBlockString(leaves, aliases, {
      leavesSelector: ':root,\n:host',
      aliasesSelector: ':host,\n:where(*)',
    }),
    'tokens.attr.css': cssVariableDeclarationsToTwoBlockString(leaves, aliases, {
      leavesSelector: '[data-esds-tokens]',
      aliasesSelector: '[data-esds-tokens],\n[data-esds-tokens] :where(*)',
    }),
  };
}
