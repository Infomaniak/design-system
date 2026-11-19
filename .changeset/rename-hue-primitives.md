---
'@infomaniak-design-system/tokens': minor
---

**Breaking:** renamed three primitive color hues to match the Figma Token Core naming. Color values are unchanged, only names move:

- `color.indigo.*` → `color.cobalt.*`
- `color.purple.*` → `color.indigo.*`
- `color.violet.*` → `color.purple.*`

The violet data-viz palette is renamed accordingly: `color.{background,border,content}.dataviz.violet.*` and `color.{border,content}.on.dataviz.violet.*` become `…dataviz.purple.*`, and the `violet` dataviz context becomes `purple`.

Semantic brand tokens (kDrive, Security, Contacts, visited links) keep their names and colors. If you use the primitive CSS variables directly, update them: `--esds-color-indigo-*` now holds the former purple values and `--esds-color-purple-*` the former violet values.
