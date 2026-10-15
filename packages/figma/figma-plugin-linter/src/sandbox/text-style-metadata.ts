import type { TextStyleInfo } from '../core/model/text-style-info.ts';
import { buildTextStyleInfo } from '../core/model/text-style-info.ts';

/**
 * Structural surface of the Figma API the loader reads from — the real methods
 * live directly on `figma` (no `textStyles` sub-object, unlike variables).
 * `getStyleByIdAsync` returns the wide `BaseStyle` union; the loader narrows
 * text styles through the discriminating `type` field.
 */
export interface TextStylesMetadataApi {
  getLocalTextStylesAsync(): Promise<readonly TextStyle[]>;
  getStyleByIdAsync(styleId: string): Promise<BaseStyle | null>;
}

/**
 * Builds the per-run text-style metadata map (Figma style lookups are async;
 * rule evaluation stays sync).
 *
 * Source 1: all text styles local to the file (bulk, cheap — remote is false
 * by definition). Source 2: referenced style ids that are not local — typically
 * styles applied from a published library — resolved one by one through
 * `getStyleByIdAsync`; ids that resolve to nothing stay out of the map.
 *
 * The record-building/normalization logic (`buildTextStyleInfo`) is shared with
 * the `style-override` rule: node props and style props are compared through
 * the same normalized shape.
 */
export async function loadTextStyleMetadata(
  api: TextStylesMetadataApi,
  referencedStyleIds: readonly string[] = [],
): Promise<Map<string, TextStyleInfo>> {
  const localStyles: readonly TextStyle[] = await api.getLocalTextStylesAsync();

  const stylesById: Map<string, TextStyleInfo> = new Map(
    localStyles.map((style: TextStyle): readonly [string, TextStyleInfo] => [
      style.id,
      buildTextStyleInfo(style),
    ]),
  );

  const remoteIds: readonly string[] = [...new Set(referencedStyleIds)].filter(
    (styleId: string): boolean => !stylesById.has(styleId),
  );

  await Promise.all(
    remoteIds.map(async (styleId: string): Promise<void> => {
      const style: BaseStyle | null = await api.getStyleByIdAsync(styleId);

      if (style !== null && style.type === 'TEXT') {
        stylesById.set(styleId, buildTextStyleInfo(style));
      }
    }),
  );

  return stylesById;
}
