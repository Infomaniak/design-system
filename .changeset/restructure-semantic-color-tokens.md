---
'@infomaniak-design-system/tokens': minor
---

Restructured the semantic color tokens: removed the `default`, `hover`, `pressed`, and `selected` interaction states from background, border, content, and brand tokens. The previous `default` value now lives directly on the token (e.g. `color.background.elevation.sunken` instead of `color.background.elevation.sunken.default`). Consumers must update any references to the removed state variants.

Introduced a `$root` token concept for shared base values across themed tokens, with matching export support in the Figma and Swift build outputs.

Added new semantic background tokens: per-product brand colors (including Euria), feedback colors (success, warning, error) with `dim1`/`dim2` variants, and data-visualization backgrounds across hues.

Added new alpha-variant primitive colors (e.g. `color.blue.50-12`, `color.blue.900-80`).

Removed the unused `shadow.0` primitive token and simplified the text-link component tokens to `content.color.default` and `content.color.visited`.
