import type { VariableInfo } from './model/variable-info.ts';

/**
 * Recognized kit libraries, matched as a case-insensitive name prefix: the
 * Edelweiss platform kits (Token Core, Material Kit, Shadcn kit, iOS-iPadOS
 * kit — all named `Edelweiss - …`) publish tokens the linter must accept, and
 * they add collections over time (`button-type`, `badge-type`, …). Matching
 * the LIBRARY keeps that maintenance-free: a new collection inside a known
 * library is recognized without a plugin change, while genuinely foreign
 * libraries keep the unknown-collection warning.
 */
const KNOWN_KIT_LIBRARY_PREFIXES: readonly string[] = ['edelweiss'];

/**
 * Raw palette collections shipped inside kit libraries (`Red/100`… in the
 * Material Kit). Everything Edelweiss-published is ours, but binding a raw
 * palette step should still warn — the same signal `primitive-misuse` gives
 * for t1 tokens, which kit palettes (tier `unknown`) would otherwise escape.
 */
const KIT_RAW_COLLECTIONS: ReadonlySet<string> = new Set(['primitives']);

/**
 * Variable-name namespaces of the platform kits, verified against the files:
 * `Schemes/…` are the Material Design scheme roles of the Edelweiss Material
 * Kit. Static fallback for tokens bound from a kit library that is no longer
 * enabled (the import pass cannot enumerate it, so no stamp could be applied).
 * First-segment match, case-insensitive.
 */
const KNOWN_KIT_NAME_NAMESPACES: ReadonlySet<string> = new Set(['schemes']);

/** Whether a library is a recognized Edelweiss kit library. */
export function isKnownKitLibrary(libraryName: string): boolean {
  const name: string = libraryName.trim().toLowerCase();

  return KNOWN_KIT_LIBRARY_PREFIXES.some((prefix: string): boolean => name.startsWith(prefix));
}

/**
 * Whether a bound variable comes from a known Edelweiss kit: stamped by the
 * library-import pass (minus the raw palette collections) or carrying a known
 * kit name namespace. Remote only — a local copy of a kit collection is a
 * duplicate (like a duplicated kit icon) and keeps the warning. The tier is
 * not consulted: known kits keep their `unknown` tier, so they are exempted
 * from `unknown-collection` yet never suggested as fixes.
 */
export function isKnownKitVariable(variable: VariableInfo): boolean {
  if (!variable.remote) {
    return false;
  }

  const namespace: string | undefined = variable.nameSegments[0];

  if (namespace !== undefined && KNOWN_KIT_NAME_NAMESPACES.has(namespace.toLowerCase())) {
    return true;
  }

  return (
    variable.knownKit === true &&
    !KIT_RAW_COLLECTIONS.has(variable.collectionName.trim().toLowerCase())
  );
}
