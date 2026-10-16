/**
 * Name prefix used by the Edelweiss Iconography library for its icon
 * components (e.g. `esds/icon/plus`). The library publishes its own token
 * collection (named `Collection 1`, not a t1/t2/t3 tier), which is expected —
 * icons carry their library's own stroke-width tokens, not DS token tiers.
 */
export const ICON_LIBRARY_COMPONENT_PREFIX: string = 'esds/icon/';

/**
 * Whether a component identity name belongs to the DS icon library. Used to
 * exempt bindings inside icon instances from rules that classify token tiers
 * (`unknown-collection`).
 */
export function isIconLibraryComponent(name: string): boolean {
  return name.startsWith(ICON_LIBRARY_COMPONENT_PREFIX);
}

/**
 * Normalizes a node name into its icon-library leaf name: the `esds/icon/`
 * prefix, when present, is stripped (`esds/icon/plus` → `plus`).
 */
export function toIconLeafName(name: string): string {
  return isIconLibraryComponent(name) ? name.slice(ICON_LIBRARY_COMPONENT_PREFIX.length) : name;
}

/**
 * Whether a node name denotes an icon from the inventory: the leaf name (after
 * prefix stripping) must match an entry exactly. Partial or renamed names
 * (`plus copy`, `icon plus`) never match — the heuristic is deliberately
 * exact-match-only.
 */
export function matchesIconInventory(name: string, iconNames: ReadonlySet<string>): boolean {
  return iconNames.has(toIconLeafName(name));
}
