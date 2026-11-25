import type { CssVariableDeclaration } from './css-variable-declaration.ts';

export function cssVariableDeclarationReferencesCssVariable(
  declaration: CssVariableDeclaration,
): boolean {
  if (declaration.value.includes('var(')) {
    return true;
  }

  return (declaration.derived ?? []).some((derived: CssVariableDeclaration): boolean =>
    cssVariableDeclarationReferencesCssVariable(derived),
  );
}

export interface PartitionedCssVariableDeclarations {
  readonly leaves: CssVariableDeclaration[];
  readonly aliases: CssVariableDeclaration[];
}

export function partitionCssVariableDeclarations(
  declarations: readonly CssVariableDeclaration[],
): PartitionedCssVariableDeclarations {
  const leaves: CssVariableDeclaration[] = [];
  const aliases: CssVariableDeclaration[] = [];

  for (const declaration of declarations) {
    const bucket: CssVariableDeclaration[] = cssVariableDeclarationReferencesCssVariable(
      declaration,
    )
      ? aliases
      : leaves;

    bucket.push(declaration);
  }

  return { leaves, aliases };
}
