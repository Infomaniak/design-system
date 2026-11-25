import { indent } from '../../../../../../../../../../../scripts/helpers/misc/string/indent/indent.ts';
import type { CssVariableDeclaration } from '../../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import { cssVariableDeclarationsToString } from '../../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/css-variable-declarations-to-string.ts';
import { wrapCssVariableDeclarationsWithCssSelector } from '../../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/to/wrap-css-variable-declarations-with-css-selector.ts';
import { AUTO_GENERATED_FILE_HEADER } from '../../../../constants/auto-generated-file-header.ts';

export const CSS_AUTO_GENERATED_FILE_HEADER = `/*
  ${indent(AUTO_GENERATED_FILE_HEADER)}
*/
`;

export interface CssVariableTwoBlockOptions {
  readonly leavesSelector: string;
  readonly aliasesSelector: string;
}

export function cssVariableDeclarationsToTwoBlockString(
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
