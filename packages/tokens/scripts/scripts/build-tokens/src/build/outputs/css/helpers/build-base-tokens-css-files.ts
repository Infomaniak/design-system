import { indent } from '../../../../../../../../../../scripts/helpers/misc/string/indent/indent.ts';
import type { CssVariableDeclaration } from '../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import {
  partitionCssVariableDeclarations,
  type PartitionedCssVariableDeclarations,
} from '../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/references-css-variable.ts';
import { cssVariableDeclarationsToString } from '../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/css-variable-declarations-to-string.ts';
import { wrapCssVariableDeclarationsWithCssSelector } from '../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/wrap-css-variable-declarations-with-css-selector.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../../constants/auto-generated-file-header.ts';

export const CSS_AUTO_GENERATED_FILE_HEADER = `/*
  ${indent(AUTO_GENERATED_FILE_HEADER)}
*/
`;

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

/* INTERNAL */

interface CssVariableTwoBlockOptions {
  readonly leavesSelector: string;
  readonly aliasesSelector: string;
}

function cssVariableDeclarationsToTwoBlockString(
  leaves: readonly CssVariableDeclaration[],
  aliases: readonly CssVariableDeclaration[],
  { leavesSelector, aliasesSelector }: CssVariableTwoBlockOptions,
): string {
  const blocks: string[] = [];

  if (leaves.length > 0) {
    blocks.push(
      wrapCssVariableDeclarationsWithCssSelector(
        cssVariableDeclarationsToString(leaves),
        leavesSelector,
      ),
    );
  }

  if (aliases.length > 0) {
    blocks.push(
      wrapCssVariableDeclarationsWithCssSelector(
        cssVariableDeclarationsToString(aliases),
        aliasesSelector,
      ),
    );
  }

  return `${CSS_AUTO_GENERATED_FILE_HEADER}${blocks.join('\n')}`;
}
