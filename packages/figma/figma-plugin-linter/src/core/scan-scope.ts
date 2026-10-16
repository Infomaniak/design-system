export type ScanScope = 'selection' | 'page' | 'file';

/**
 * Which node source the sandbox must read for a scope. The sandbox maps each
 * descriptor to its Figma API call (`figma.currentPage.selection`,
 * `figma.currentPage.children`, every page's children); this module owns the
 * decision, not the API access.
 */
export type ScanRootsDescriptor = 'selection' | 'page-children' | 'all-pages-children';

export const DEFAULT_SCAN_SCOPE: ScanScope = 'selection';

const SCAN_ROOTS: Readonly<Record<ScanScope, ScanRootsDescriptor>> = {
  selection: 'selection',
  page: 'page-children',
  file: 'all-pages-children',
};

/**
 * Normalizes a scope coming from the panel — unknown or missing values fall
 * back to the default `selection` scope.
 */
export function parseScanScope(value: string | undefined): ScanScope {
  return value === 'page' || value === 'file' ? value : DEFAULT_SCAN_SCOPE;
}

export function scanRootsFor(scope: ScanScope): ScanRootsDescriptor {
  return SCAN_ROOTS[scope];
}

/**
 * Whether the scope requires a non-empty selection to run (the empty-selection
 * setup error only applies to the selection scope; an empty page or file is a
 * clean pass).
 */
export function requiresSelection(scope: ScanScope): boolean {
  return scope === 'selection';
}
