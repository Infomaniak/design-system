---
'@infomaniak-design-system/components': minor
'@infomaniak-design-system/tokens': minor
---

Added the `esds-kbd` custom attribute, which styles native `<kbd>` elements as keyboard keys (background, border, and typography driven by design tokens). The attribute can only be used on `<kbd>` elements, preserving native semantics. Multi-key shortcuts are written as a single `<kbd esds-kbd>` element containing the full combination (e.g. `⌘+K`).
