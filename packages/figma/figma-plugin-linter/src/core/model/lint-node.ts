import type { LintProperty } from './lint-property.ts';

export type LintNodeType = 'FRAME' | 'GROUP' | 'TEXT' | 'SHAPE' | 'INSTANCE';

export interface LintNode {
  readonly id: string;
  readonly name: string;
  readonly type: LintNodeType;
  readonly visible: boolean;
  readonly properties: readonly LintProperty[];
  readonly children: readonly LintNode[];
  /**
   * True when the node lives inside a component instance verified to come from
   * the DS icon library (`esds/icon/…`, main component remote — published from
   * the team library): the library carries its own token collection, so
   * tier-classifying rules exempt these bindings. Local components reusing the
   * naming convention are not marked.
   */
  readonly fromIconLibrary?: boolean;
  /** Figma's own asset heuristic: true for small vector graphics and raster images. */
  readonly isAsset?: boolean;
  /** Node bounds in px (unrotated) — icon-size detection. Absent when unknown. */
  readonly width?: number;
  readonly height?: number;
  /**
   * True when the node or any of its descendants carries a visible image
   * paint: `isAsset` also fires for raster images, so icon rules use this to
   * stay silent on image assets (photos, avatars) and the components holding
   * them.
   */
  readonly hasImageFill?: boolean;
}
