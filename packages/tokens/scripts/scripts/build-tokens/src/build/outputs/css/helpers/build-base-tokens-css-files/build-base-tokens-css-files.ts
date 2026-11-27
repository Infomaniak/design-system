import type { CssVariableDeclaration } from '../../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import {
  partitionCssVariableDeclarations,
  type PartitionedCssVariableDeclarations,
} from '../../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/references-css-variable.ts';
import { cssVariableDeclarationsToTwoBlockString } from '../css-variable-declarations-to-two-block-string/css-variable-declarations-to-two-block-string.ts';

export interface BaseTokensCssFiles {
  readonly 'tokens.root.css': string;
  readonly 'tokens.attr.css': string;
}

export function buildBaseTokensCssFiles(
  declarations: readonly CssVariableDeclaration[],
  dynamicNames: ReadonlySet<string>,
): BaseTokensCssFiles {
  const { leaves, aliases }: PartitionedCssVariableDeclarations =
    partitionCssVariableDeclarations(declarations);

  const staticAliases: CssVariableDeclaration[] = aliases.filter(
    (declaration: CssVariableDeclaration): boolean => !dynamicNames.has(declaration.name),
  );
  const dynamicAliases: CssVariableDeclaration[] = aliases.filter(
    (declaration: CssVariableDeclaration): boolean => dynamicNames.has(declaration.name),
  );

  const scopeDeclarations: readonly CssVariableDeclaration[] = [...leaves, ...staticAliases];

  return {
    'tokens.root.css': cssVariableDeclarationsToTwoBlockString(scopeDeclarations, dynamicAliases, {
      leavesSelector: ':root,\n:host',
      aliasesSelector: ':host,\n:where(*)',
    }),
    'tokens.attr.css': cssVariableDeclarationsToTwoBlockString(scopeDeclarations, dynamicAliases, {
      leavesSelector: '[data-esds-tokens]',
      aliasesSelector: '[data-esds-tokens],\n[data-esds-tokens] :where(*)',
    }),
  };
}
