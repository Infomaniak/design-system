---
'@infomaniak-design-system/tokens': minor
---

Synced DTCG tokens from the latest Figma export.

- Added subtle `dim3` data-viz variants: new `color.background.dataviz.*.dim3` backgrounds and matching `color.content.on.dataviz.*.dim3` foregrounds, plus per-hue `color.content.dataviz.*` foreground tokens, available in both themes and the dataviz overrides.
- Softened the strong `dim1` data-viz backgrounds (`600` → `500` shades) and re-paired the `dim1`/`dim2` foregrounds placed on them for proper contrast in light and dark themes.
- Feedback foregrounds on strong backgrounds are now white; the tinted shades moved to the `dim2` variants and new `dim3` foregrounds were added.
- Lightened the `error`, `success`, `warning`, `information` and `neutral` interaction-state content colors (`700` → `600` shades; `warning` now `orange.500`).
