import type { EffectStyleInfo } from '../core/model/effect-style-info.ts';

/**
 * Structural surface of the Figma API the loader reads from — the real methods
 * live directly on `figma` (no `effectStyles` sub-object, unlike variables).
 * `getStyleByIdAsync` returns the wide `BaseStyle` union; the loader narrows
 * effect styles through the discriminating `type` field.
 */
export interface EffectStylesMetadataApi {
  getLocalEffectStylesAsync(): Promise<readonly EffectStyle[]>;
  getStyleByIdAsync(styleId: string): Promise<BaseStyle | null>;
}

/**
 * Builds the per-run effect-style metadata map (Figma style lookups are async;
 * rule evaluation stays sync).
 *
 * Source 1: all effect styles local to the file (bulk, cheap — remote is false
 * by definition). Source 2: referenced style ids that are not local — typically
 * styles applied from a published library — resolved one by one through
 * `getStyleByIdAsync`; ids that resolve to nothing stay out of the map.
 */
export async function loadEffectStyleMetadata(
  api: EffectStylesMetadataApi,
  referencedStyleIds: readonly string[] = [],
): Promise<Map<string, EffectStyleInfo>> {
  const localStyles: readonly EffectStyle[] = await api.getLocalEffectStylesAsync();

  const stylesById: Map<string, EffectStyleInfo> = new Map(
    localStyles.map((style: EffectStyle): readonly [string, EffectStyleInfo] => [
      style.id,
      { id: style.id, name: style.name, remote: false },
    ]),
  );

  const remoteIds: readonly string[] = [...new Set(referencedStyleIds)].filter(
    (styleId: string): boolean => !stylesById.has(styleId),
  );

  await Promise.all(
    remoteIds.map(async (styleId: string): Promise<void> => {
      const style: BaseStyle | null = await api.getStyleByIdAsync(styleId);

      if (style !== null && style.type === 'EFFECT') {
        stylesById.set(styleId, { id: style.id, name: style.name, remote: style.remote ?? true });
      }
    }),
  );

  return stylesById;
}
