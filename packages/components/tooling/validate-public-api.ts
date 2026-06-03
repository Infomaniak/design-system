import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { getPublicApiSourceFiles } from './public-api-scan.ts';

interface Violation {
  filePath: string;
  line: number;
  name: string;
  kind: string;
  reasons: string[];
}

type ExportableNode =
  | ts.FunctionDeclaration
  | ts.ClassDeclaration
  | ts.InterfaceDeclaration
  | ts.TypeAliasDeclaration
  | ts.VariableStatement
  | ts.EnumDeclaration;

function isExportableNode(node: ts.Node): node is ExportableNode {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isVariableStatement(node) ||
    ts.isEnumDeclaration(node)
  );
}

function getExportName(node: ExportableNode): string | null {
  if (ts.isVariableStatement(node)) {
    const names: string[] = [];
    for (const decl of node.declarationList.declarations) {
      if (ts.isIdentifier(decl.name)) {
        names.push(decl.name.text);
      }
    }
    return names.join(', ') || null;
  }

  return node.name?.text ?? null;
}

function hasExportModifier(node: ExportableNode): boolean {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  return (
    modifiers?.some((m: ts.ModifierLike): boolean => m.kind === ts.SyntaxKind.ExportKeyword) ??
    false
  );
}

function hasInternalJSDoc(node: ExportableNode): boolean {
  const tags = ts.getJSDocTags(node);
  return tags.some((tag): boolean => tag.tagName.text === 'internal');
}

function hasPrivateOrProtectedModifier(node: ExportableNode): boolean {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  return (
    modifiers?.some(
      (m: ts.ModifierLike): boolean =>
        m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword,
    ) ?? false
  );
}

function startsWithUnderscore(name: string): boolean {
  return name.startsWith('_');
}

function checkNode(node: ts.Node, sourceFile: ts.SourceFile, filePath: string): Violation[] {
  const violations: Violation[] = [];

  ts.forEachChild(node, (child) => {
    if (!isExportableNode(child) || !hasExportModifier(child)) {
      return;
    }

    const name = getExportName(child);
    if (!name) return;

    const reasons: string[] = [];

    if (hasInternalJSDoc(child)) {
      reasons.push('has @internal JSDoc');
    }

    if (hasPrivateOrProtectedModifier(child)) {
      reasons.push('has private/protected modifier');
    }

    if (startsWithUnderscore(name)) {
      reasons.push("starts with '_'");
    }

    if (reasons.length > 0) {
      const pos = child.getStart(sourceFile);
      const line = sourceFile.getLineAndCharacterOfPosition(pos).line + 1;
      const kind = ts.SyntaxKind[child.kind];

      violations.push({
        filePath: path.relative(path.resolve(process.cwd(), 'src'), filePath),
        line,
        name,
        kind,
        reasons,
      });
    }
  });

  return violations;
}

function validateFile(filePath: string): Violation[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

  return checkNode(sourceFile, sourceFile, filePath);
}

export function validatePublicApi(): boolean {
  const files = getPublicApiSourceFiles();
  const allViolations: Violation[] = [];

  for (const file of files) {
    const violations = validateFile(file.absolutePath);
    allViolations.push(...violations);
  }

  if (allViolations.length === 0) {
    return true;
  }

  console.error('');
  console.error(
    `ERROR: ${allViolations.length} violation(s) found. Move helpers to *.private.ts or remove the export.`,
  );
  console.error('');

  for (const v of allViolations) {
    console.error(`ERROR: ${v.filePath}:${v.line}`);
    console.error(`       ${v.kind} ${v.name}`);
    console.error(`       └─ Reason: ${v.reasons.join(', ')}`);
    console.error('');
  }

  return false;
}

// If this script is run directly, not imported
if (import.meta.url === `file://${process.argv[1]}`) {
  const isValid = validatePublicApi();
  if (isValid) {
    console.log('✅ No internal/private exports found in public API');
  }
  process.exit(isValid ? 0 : 1);
}
