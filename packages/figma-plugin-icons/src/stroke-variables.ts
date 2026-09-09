import type { DetectedStrokeVariable } from './messages.ts';
import type { StrokeConfig } from './tokens.ts';
import { ICON_SIZES, type IconSize } from './tokens.ts';

/**
 * Extract the icon size targeted by a stroke variable name.
 * The name must contain "stroke" and its first number must be a known icon size
 * (e.g. `stroke/16`, `stroke_20`).
 */
export function parseStrokeSizeFromName(name: string): IconSize | null {
  if (!name.toLowerCase().includes('stroke')) {
    return null;
  }
  const match = name.match(/(\d+)/);
  if (!match) {
    return null;
  }
  const size = Number.parseInt(match[1], 10);
  return (ICON_SIZES as readonly number[]).includes(size) ? (size as IconSize) : null;
}

/**
 * Detect stroke variables exposed by the enabled Figma team libraries.
 * Figma-coupled: reads `figma.teamLibrary` collections.
 */
export async function detectStrokeVariables(): Promise<DetectedStrokeVariable[]> {
  const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  const detected: DetectedStrokeVariable[] = [];

  for (const collection of collections) {
    const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection.key);
    for (const variable of variables) {
      const size = parseStrokeSizeFromName(variable.name);
      if (size !== null) {
        detected.push({
          name: variable.name,
          size,
          collection: collection.name,
          key: variable.key,
        });
      }
    }
  }

  return detected;
}

/**
 * Resolve the value of each detected stroke variable and merge it into the
 * given config. Unresolvable variables are skipped. Figma-coupled.
 */
export async function applyStrokeVariables(
  variables: readonly DetectedStrokeVariable[],
  config: StrokeConfig,
): Promise<StrokeConfig> {
  const next: StrokeConfig = { ...config };

  for (const variable of variables) {
    try {
      const resolved = await figma.variables.getVariableByIdAsync(variable.key);
      if (!resolved) {
        continue;
      }
      const modes = Object.keys(resolved.valuesByMode);
      if (modes.length === 0) {
        continue;
      }
      const value = resolved.valuesByMode[modes[0]];
      if (typeof value === 'number') {
        next[variable.size] = value;
      }
    } catch {
      // Skip variables that cannot be resolved from the current file context.
    }
  }

  return next;
}
