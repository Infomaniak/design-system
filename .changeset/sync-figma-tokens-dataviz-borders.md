---
'@infomaniak-design-system/tokens': minor
---

Synced DTCG tokens from the latest Figma export. Data-viz border tokens were restructured to match the data-viz foreground structure:

- `color.border.dataviz.<hue>` is now a single token (holding the former `dim1` value), replacing the `dim1`/`dim2` variants. Orange and yellow borders moved from the 600 to the 500 shade, aligning with their data-viz foreground colors.
- Added `color.border.on.dataviz.<hue>.{dim1,dim2,dim3}` tokens for borders drawn on data-viz backgrounds: no border (`transparent`) on strong backgrounds, and theme-aware shades on soft (`dim2`) and subtle (`dim3`) backgrounds.

Consumers referencing the removed `--esds-color-border-dataviz-<hue>-dim1` / `-dim2` CSS custom properties must update to the new token paths.
