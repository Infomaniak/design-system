---
'@infomaniak-design-system/tokens': patch
'@infomaniak-design-system/components': patch
---

Added `button.size` design tokens. Square `esds-button` elements are now sized by the design system (32 px for `small`, 40 px for `medium` — also the default — and 50 px for `large`) instead of a hardcoded 50 px fallback, so they previously ignored the selected `data-esds-button-size` and always rendered 50 px.
