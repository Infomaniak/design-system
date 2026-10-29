---
'@infomaniak-design-system/tokens': minor
---

Sync DTCG tokens from the Figma export:

- Renamed the primitive `scale` tokens to `dimension`; all values are unchanged (including `50`), references now point to `{dimension.N}`.
- Added `dim1` feedback color variants (success, warning, error, information, neutral) for light and dark themes.
- Added italic font weight tokens (`weight.400-italic`, `weight.500-italic`).
- Badge tokens now use the new `dim1` feedback colors (background and content).
