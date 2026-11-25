import type { CssVariableDeclaration } from './css-variable-declaration.ts';

/**
 * Compares two CSS variable declarations by the values they emit, ignoring
 * documentation-only differences (description, deprecated): two declarations
 * with equal name, value and derived declarations produce the same CSS output.
 */
export function areCssVariableDeclarationValuesEqual(
  a: CssVariableDeclaration,
  b: CssVariableDeclaration,
): boolean {
  return (
    a.name === b.name &&
    a.value === b.value &&
    areDerivedDeclarationsValuesEqual(a.derived, b.derived)
  );
}

function areDerivedDeclarationsValuesEqual(
  a: readonly CssVariableDeclaration[] | undefined,
  b: readonly CssVariableDeclaration[] | undefined,
): boolean {
  if (a === undefined || b === undefined) {
    return a === b;
  }

  return (
    a.length === b.length &&
    a.every((declaration: CssVariableDeclaration, index: number): boolean =>
      areCssVariableDeclarationValuesEqual(declaration, b[index]!),
    )
  );
}
