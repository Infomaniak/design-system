---
'@infomaniak-design-system/tokens': patch
---

Synced DTCG tokens from the latest Figma export.

- Refreshed the `red` color ramp (all 10 shades updated to the new reds).
- Darkened the strong (`dim1`) feedback backgrounds (`color.background.feedback.*.dim1`): `success`/`warning`/`error`/`information` moved one shade darker, `neutral` now `gray.500`.
- Lightened the selected-state and focus overlays (`color.selected.*`): `20%/40%/80%` opacities replaced by `6%/12%/60%`, with matching theme shadow adjustments.
- Swapped the light-theme elevated surfaces: `background.elevation.raised` is now `gray.50` and `background.elevation.overlay` is white.
- Unified `color.border.dim1` to `gray.400` in both themes (previously `gray.500` in dark mode).
