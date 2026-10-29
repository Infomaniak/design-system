---
'@infomaniak-design-system/tokens': minor
---

Sync DTCG tokens from the Figma export:

- Renamed the primitive `scale` tokens to `dimensions`; all values are unchanged (including `50`), references now point to `{dimensions.N}`.
- Added `dim1` feedback color variants (success, warning, error, information, neutral) for light and dark themes.
- Added italic font weight tokens (`weight.400-italic`, `weight.500-italic`).
- Removed the badge component tokens and the `badge-type` modifiers, no longer part of the Figma token export.
