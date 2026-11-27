import { areCssVariableDeclarationValuesEqual } from '../../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/are-css-variable-declaration-values-equal.ts';
import type { CssVariableDeclaration } from '../../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/css-variable-declaration.ts';
import {
  partitionCssVariableDeclarations,
  type PartitionedCssVariableDeclarations,
} from '../../../../../../../../shared/dtcg/resolver/to/css/css-variable-declaration/references-css-variable.ts';
import { cssVariableDeclarationsToTwoBlockString } from '../css-variable-declarations-to-two-block-string/css-variable-declarations-to-two-block-string.ts';

export interface ModifierContextCssFiles {
  readonly root: string;
  readonly attr: string;
}

export interface BuildModifierContextCssFilesOptions {
  readonly modifier: string;
  readonly context: string;
  readonly declarations: readonly CssVariableDeclaration[];
  readonly baseDeclarations: readonly CssVariableDeclaration[];
}

export function buildModifierContextCssFiles({
  modifier,
  context,
  declarations,
  baseDeclarations,
}: BuildModifierContextCssFilesOptions): ModifierContextCssFiles {
  const { leaves, aliases }: PartitionedCssVariableDeclarations = partitionCssVariableDeclarations(
    filterDeclarationsDifferingFromBase(declarations, baseDeclarations),
  );

  const scopeSelector: string = `[data-esds-${modifier}="${context}"]`;

  return {
    root: cssVariableDeclarationsToTwoBlockString(leaves, aliases, {
      leavesSelector: ':root,\n:host',
      aliasesSelector: ':host,\n:where(*)',
    }),
    attr: cssVariableDeclarationsToTwoBlockString(leaves, aliases, {
      leavesSelector: scopeSelector,
      aliasesSelector: `${scopeSelector},\n${scopeSelector} :where(*)`,
    }),
  };
}

/* INTERNAL */

function filterDeclarationsDifferingFromBase(
  declarations: readonly CssVariableDeclaration[],
  baseDeclarations: readonly CssVariableDeclaration[],
): CssVariableDeclaration[] {
  const baseByName: Map<string, CssVariableDeclaration> = new Map(
    baseDeclarations.map(
      (declaration: CssVariableDeclaration): [string, CssVariableDeclaration] => [
        declaration.name,
        declaration,
      ],
    ),
  );

  return declarations.filter((declaration: CssVariableDeclaration): boolean => {
    const base: CssVariableDeclaration | undefined = baseByName.get(declaration.name);

    return base === undefined || !areCssVariableDeclarationValuesEqual(base, declaration);
  });
}
