import { dirname, join } from 'node:path/posix';
import { extractRawMdImports } from './raw-md.ts';

const COMPONENT_TAG_PATTERN: RegExp = /\bcomponent:\s*['"]([A-Za-z][A-Za-z0-9_-]*)['"]/;

export function extractRawDocImportPath(storiesSource: string): string | null {
  const rawImports = extractRawMdImports(storiesSource);
  return rawImports.length === 0 ? null : rawImports[0].importPath;
}

export function extractComponentTag(storiesSource: string): string | null {
  const match = COMPONENT_TAG_PATTERN.exec(storiesSource);
  return match === null ? null : match[1];
}

export function resolveImportPath(fromFile: string, relImport: string): string {
  return join(dirname(fromFile), relImport);
}

export interface ComponentDocs {
  tagName: string | null;
  prose: string | null;
}

export function loadComponentDocs(input: {
  storiesFilePath: string;
  storiesSource: string;
  readFile: (path: string) => string;
}): ComponentDocs {
  const rawDocImportPath = extractRawDocImportPath(input.storiesSource);
  let prose: string | null = null;
  if (rawDocImportPath !== null) {
    try {
      prose = input.readFile(resolveImportPath(input.storiesFilePath, rawDocImportPath));
    } catch {
      prose = null;
    }
  }
  return { tagName: extractComponentTag(input.storiesSource), prose };
}
