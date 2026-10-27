---
'@infomaniak-design-system/components': patch
---

Fixed `esds-icon` vertical alignment when placed inside a box larger than the icon (e.g. forced `width`/`height`): the svg is now centered instead of top-aligned. The host element is now `inline-flex`.
