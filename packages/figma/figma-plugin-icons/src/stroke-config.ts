import type { StrokeConfig } from './tokens.ts';
import { DEFAULT_STROKE_WEIGHTS, ICON_SIZES } from './tokens.ts';

/** Minimal async key-value store abstraction (implemented over `figma.clientStorage`). */
export interface KeyValueStore {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

const STORAGE_KEY = 'strokeConfig';

/**
 * Validate and normalize an unknown value into a complete stroke config.
 * Returns `null` when the value does not provide a finite number for every icon size.
 */
export function parseStrokeConfig(value: unknown): StrokeConfig | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }
  const record = value as Record<string, unknown>;
  const config = {} as StrokeConfig;
  for (const size of ICON_SIZES) {
    const raw = record[String(size)];
    if (typeof raw !== 'number' || !Number.isFinite(raw)) {
      return null;
    }
    config[size] = raw;
  }
  return config;
}

/**
 * Load the stroke config persisted for this user, falling back to the
 * design-system defaults when nothing is stored or the value is invalid.
 */
export async function loadStrokeConfig(store: KeyValueStore): Promise<StrokeConfig> {
  try {
    const saved = parseStrokeConfig(await store.get(STORAGE_KEY));
    return saved ?? { ...DEFAULT_STROKE_WEIGHTS };
  } catch {
    return { ...DEFAULT_STROKE_WEIGHTS };
  }
}

/** Persist the stroke config. Returns `false` when the storage write failed. */
export async function saveStrokeConfig(
  store: KeyValueStore,
  config: StrokeConfig,
): Promise<boolean> {
  try {
    await store.set(STORAGE_KEY, { ...config });
    return true;
  } catch {
    return false;
  }
}

export interface ResetStrokeConfigResult {
  readonly config: StrokeConfig;
  /** Whether the reset could be persisted. */
  readonly saved: boolean;
}

/** Reset the stroke config to the design-token defaults and persist it. */
export async function resetStrokeConfig(store: KeyValueStore): Promise<ResetStrokeConfigResult> {
  const config: StrokeConfig = { ...DEFAULT_STROKE_WEIGHTS };
  const saved = await saveStrokeConfig(store, config);
  return { config, saved };
}
