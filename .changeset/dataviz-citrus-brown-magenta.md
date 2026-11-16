---
'@infomaniak-design-system/tokens': minor
---

Updated the data-viz palette, aligning it with the Figma Token Core:

- **Breaking:** the `purple` data-viz color is replaced by `citrus`, a new lime-green that stands apart from `emerald`. All `color.*.dataviz.purple.*` tokens are renamed to `color.*.dataviz.citrus.*`, and the `dataviz` modifier value `purple` becomes `citrus`. The `color.purple.*` primitives are unchanged.
- On strong citrus backgrounds (`dim1`), text now uses `color.citrus.950` in light theme for readable contrast.
- Added `brown` and `magenta` data-viz colors (background, content and border tokens, plus `dataviz` modifier values).
- Added the `color.brown.*`, `color.magenta.*` and `color.citrus.*` primitive palettes (50 to 950).
